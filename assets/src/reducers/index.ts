import { combineReducers } from "redux";
import listReducer from "../features/list/listSlice";
import socketIOReducer from "../features/socketio/socketIOSlice";
import notificationsReducer from "../features/notifications/notificationsSlice";
import { TypedUseSelectorHook, useSelector } from "react-redux";

export const supplies = combineReducers({
  items: listReducer,
  socketio: socketIOReducer,
  notifications: notificationsReducer,
});

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

export type RootState = ReturnType<typeof supplies>;
