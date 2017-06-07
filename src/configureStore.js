import { createStore, applyMiddleware, combineReducers } from 'redux';

export default function ConfigureStore(reducers, initialState, middleware = []) {
    const reducer = combineReducers(reducers);
    return createStore(reducer,  initialState, applyMiddleware(...middleware));
}