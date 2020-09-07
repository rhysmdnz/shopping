import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { OptionsObject } from 'notistack';
import { castDraft } from 'immer'


export interface Notification {
    key?: Key
    message: string,
    options?: OptionsObject
    dismissed?: boolean
}

interface Enqueue {
    key: Key
    notification: Notification
}

interface Close {
    key: Key
    dismissAll: boolean
}

interface Remove {
    key: Key
}

export type Key = string | number

const initialState: Notification[] = []

const notificationSlice = createSlice({
    name: 'notifications',
    initialState: initialState,
    reducers: {
        enqueueSnackbar: {
            reducer(state, action: PayloadAction<Enqueue>) {
                const { key, notification } = action.payload;
                state.push({ key: key, message: notification.message, options: castDraft(notification.options) })
            }, prepare(notification: Notification) {
                const key = notification.options && notification.options.key;
                return {
                    payload: {
                        key: key || new Date().getTime() + Math.random(),
                        notification: notification
                    }
                };
            }
        },
        closeSnackbar: {
            reducer(state, action: PayloadAction<Close>) {
                const { key, dismissAll } = action.payload;
                if (dismissAll) {
                    state.forEach((notif) => {
                        notif.dismissed = true;
                    })
                } else {
                    const notif = state.find((n) => n.key === key)
                    if (notif) {
                        notif.dismissed = true;
                    }
                }
            }, prepare(key: Key) {
                return {
                    payload: {
                        dismissAll: !key,
                        key: key
                    }
                };
            }
        },
        removeSnackbar: {
            reducer(state, action: PayloadAction<Remove>) {
                const { key } = action.payload;
                const index = state.findIndex((n) => n.key === key)
                state.splice(index, 1)
            },
            prepare(key: Key) {
                return {
                    payload: {
                        key: key
                    }
                };
            }
        },
    }
})

export const { enqueueSnackbar, closeSnackbar, removeSnackbar } = notificationSlice.actions

export default notificationSlice.reducer