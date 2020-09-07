import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import * as serviceWorker from './serviceWorker';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import { RootState, supplies } from './reducers'
import { Provider, } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react';
import { configureStore, getDefaultMiddleware, Action } from '@reduxjs/toolkit'
import socket from './middleware/socket'
import localforage from 'localforage'
import { enqueueSnackbar } from './features/notifications/notificationsSlice';

const config = {
  key: 'supplies',
  storage: localforage,
  whitelist: ['items']
};
const reducer = persistReducer<RootState, Action>(config, supplies);

let store = configureStore({
  reducer: reducer,
  middleware: getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
    }
  }).concat(socket)
});
let persistor = persistStore(store);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode >,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register({
  onSuccess: (registration) => {
    store.dispatch(enqueueSnackbar({ message: "Ready to be used offline" }))
  }, onUpdate: (registration) => {
    const waitingServiceWorker = registration.waiting

    if (waitingServiceWorker) {
      waitingServiceWorker.addEventListener("statechange", (event: any) => {
        if (event?.target?.state === "activated") {
          store.dispatch(enqueueSnackbar({ message: "A new version is available refresh to update", options: { persist: true } }))
        }
      });
      waitingServiceWorker.postMessage({ type: "SKIP_WAITING" });
    }
  }
});
