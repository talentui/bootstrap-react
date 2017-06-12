import { createStore, applyMiddleware, combineReducers } from "redux";
import middlewareConfig, {initialState } from "app.config";
const emptyArray = [];

const getMiddlewareConfig = config => {
    let middlewares = [], callback;
    if (Object.prototype.toString.call(config) === "[object Array]") {
        middlewares = config
    } else if (typeof config === "object") {
        middlewares = config["middlewares"] || middlewares;
        callback = config["callback"];
    }
    return {middlewares, callback}
};

const composeReducer = reducer => {
    let combinedReducer;
    if (typeof reducer === "object") {
        combinedReducer = combineReducers(reducer);
    } else if (typeof reducer === "function") {
        combinedReducer = reducer;
    } else {
        throw "传入的reducer类型不对，它应该属于object或者function中的一种";
    }
    return combinedReducer;
};

const configureStore = (config, initialState) => (reducer) => {
    
    let {middlewares, callback} = getMiddlewareConfig(config);
    
    let store = createStore(
        composeReducer(reducer),
        initialState,
        applyMiddleware(...middlewares)
    );
    callback && callback(store);
    return store;
};

export default configureStore(middlewareConfig, initialState);
