import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import './index.css';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import MapContainer from './views/Map/MapContainer';
import rootReducer from './rootReducer';

const preloadedState = window.PRELOADED_STATE;

// Allow the passed state to be garbage-collected
delete window.PRELOADED_STATE;

// Create Redux store with initial state
const store = createStore(rootReducer, preloadedState, applyMiddleware(thunk));

const app = document.getElementById('app');
ReactDOM.hydrate(
  <Provider store={store}>
    <MapContainer />
  </Provider>, app,
);
