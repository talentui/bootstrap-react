import { createStore, applyMiddleware } from "redux";

export default function ConfigureStore(reducer, initialState, middleware = []) {
    return createStore(
        reducer,
        initialState,
        applyMiddleware(...middleware)
    );
}
