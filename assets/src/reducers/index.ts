import { combineReducers } from 'redux';
import listReducer from '../features/list/listSlice'
import socketIOReducer from '../features/socketio/socketIOSlice'

export const supplies = combineReducers({
  items: listReducer,
  socketio: socketIOReducer
});

export type RootState = ReturnType<typeof supplies>
