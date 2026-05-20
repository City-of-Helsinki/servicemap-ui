import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';

import rootReducer from './redux/rootReducer';

export function createAppStore(preloadedState) {
  return createStore(rootReducer, preloadedState, applyMiddleware(thunk));
}
