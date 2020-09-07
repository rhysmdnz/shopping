import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

export interface ServerAction {
  meta: {
    send: boolean;
  };
}

interface AddItem extends ServerAction {
  id: string;
  updated: string;
  value: string;
  created: string;
}

interface EditItem extends ServerAction {
  id: string;
  updated: string;
  value: string;
}

interface ToggleItem extends ServerAction {
  id: string;
  checked: boolean;
  updated: string;
}

interface RemoveItem extends ServerAction {
  id: string;
}

interface Item {
  id: string;
  value: string;
  checked: boolean;
  created: string;
  updated: string;
}

interface ShoppingListState {
  list: string[];
  items: {
    [id: string]: Item;
  };
}

let now = () => new Date().toISOString();

const initialState: ShoppingListState = {
  list: [],
  items: {},
};

const listSlice = createSlice({
  name: "items",
  initialState: initialState,
  reducers: {
    addItem: {
      reducer(state, action: PayloadAction<AddItem>) {
        const { id, value, updated, created } = action.payload;
        state.items[id] = {
          id: id,
          value: value,
          checked: false,
          created: created,
          updated: updated,
        };
        state.list.push(id);
      },
      prepare(value: string) {
        return {
          payload: {
            id: uuidv4(),
            updated: now(),
            value: value,
            created: now(),
            meta: { send: true },
          },
        };
      },
    },
    editItem: {
      reducer(state, action: PayloadAction<EditItem>) {
        const { id, value, updated } = action.payload;
        state.items[id].value = value;
        state.items[id].updated = updated;
      },
      prepare(id: string, value: string) {
        return {
          payload: {
            id: id,
            updated: now(),
            value: value,
            meta: { send: true },
          },
        };
      },
    },
    toggleItem: {
      reducer(state, action: PayloadAction<ToggleItem>) {
        const { id, checked, updated } = action.payload;
        state.items[id].checked = checked;
        state.items[id].updated = updated;
      },
      prepare(id: string, checked: boolean) {
        return {
          payload: {
            id: id,
            checked: checked,
            updated: now(),
            meta: { send: true },
          },
        };
      },
    },
    removeItem: {
      reducer(state, action: PayloadAction<RemoveItem>) {
        const { id } = action.payload;
        delete state.items[id];
        const index = state.list.indexOf(id);
        state.list.splice(index, 1);
      },
      prepare(id: string) {
        return {
          payload: {
            id: id,
            meta: { send: true },
          },
        };
      },
    },
    replaceAll(state, action: PayloadAction<ShoppingListState>) {
      state.items = action.payload.items;
      state.list = action.payload.list;
    },
  },
});

export const {
  addItem,
  editItem,
  toggleItem,
  removeItem,
  replaceAll,
} = listSlice.actions;

export default listSlice.reducer;
