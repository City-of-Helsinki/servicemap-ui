import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import MapContainer from './views/Map/MapContainer';
import servicemap from './redux/reducers';

const preloadedState = window.PRELOADED_STATE;

// Allow the passed state to be garbage-collected
delete window.PRELOADED_STATE;

// Create Redux store with initial state
const store = createStore(servicemap, preloadedState);

const app = document.getElementById('app');
ReactDOM.hydrate(
  <Provider store={store}>
    <MapContainer />
  </Provider>, app,
);
