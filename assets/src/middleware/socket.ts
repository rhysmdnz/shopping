import { Middleware, PayloadAction, Action } from "@reduxjs/toolkit";
import { ServerAction, replaceAll } from "../features/list/listSlice";
import localforage from "localforage";
import { Socket } from "phoenix";

const socket: Middleware = (store) => (next) => {
  let socketAddr;
  if (process.env.NODE_ENV === "production") {
    socketAddr = "/socket";
  } else {
    socketAddr = "ws://localhost:4000/socket";
  }
  const socket = new Socket(socketAddr);
  socket.connect();
  let channel = socket.channel("shoppinglist", {});
  channel
    .join()
    .receive("ok", async (resp) => {
      const actions:
        | PayloadAction<ServerAction>[]
        | null = await localforage.getItem("unsentActions");
      if (actions) {
        actions.forEach((action) => {
          console.log("send", action);
          channel.push(action.type, action);
        });
        await localforage.setItem("unsentActions", []);
      }
      store.dispatch({ type: "socketio/connected" });
      console.log("Request the state");
      channel.push("items/fullList", {}).receive("ok", (reply) => {
        console.log(reply);
        store.dispatch(replaceAll(reply));
      });
    })
    .receive("error", (resp) => {
      console.log("Something went wrong", resp);
    });
  channel.onError((resp) => {
    store.dispatch({ type: "socketio/reconnecting" });
  });
  channel.on("action", (action: PayloadAction<ServerAction>) => {
    console.log(action);
    action.payload.meta.send = false;
    store.dispatch(action);
  });
  return (action: any) => {
    if (action?.payload?.meta?.send) {
      if (!store.getState().socketio.connected) {
        console.log("We lost this :(");
        localforage.getItem<Action[] | null>("unsentActions").then((value) => {
          console.log("Adding", value);
          if (value === null) {
            value = [];
          }
          value.push(action);
          localforage.setItem("unsentActions", value);
        });
      } else {
        channel.push(action.type, action);
      }
    }

    return next(action);
  };
};

export default socket;
