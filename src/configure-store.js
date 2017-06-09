import { createStore, applyMiddleware, combineReducers } from "redux";

export default function ConfigureStore(reducer, initialState, middleware = []) {
    let combinedReducer;
    if (typeof reducer === "object") {
        combinedReducer = combineReducers(reducer);
    } else if (typeof reducer === "function") {
        combinedReducer = reducer;
    } else {
        throw "传入的reducer类型不对，它应该属于object或者function中的一种";
    }
    return createStore(
        combinedReducer,
        initialState,
        applyMiddleware(...middleware)
    );
}
