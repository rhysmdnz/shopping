import { createSlice, Action } from '@reduxjs/toolkit'


interface SocketIOState {
    connected: boolean
}

const initialState: SocketIOState = {
    connected: false
}

const socketIOSlice = createSlice({
    name: 'socketio',
    initialState: initialState,
    reducers: {
        connected(state, action: Action) {
            state.connected = true
        },
        reconnecting(state, action: Action) {
            state.connected = false
        }
    }
})

export const { connected, reconnecting } = socketIOSlice.actions

export default socketIOSlice.reducer