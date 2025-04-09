import { createStore, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';
import rootReducer from './reducers'; // Single import

const store = createStore(rootReducer, applyMiddleware(thunk));
export default store;