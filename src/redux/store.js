import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../rootReducer';

export default createStore(rootReducer, applyMiddleware(thunk));
