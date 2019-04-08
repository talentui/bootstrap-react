import { createStore, applyMiddleware } from "redux";
import appConfig from "_/src/app-config";
import composeReducer from "./compose-reducers";

const getMiddlewareConfig = (config = {}) => {
    let middlewares = [],
        callback,
        initialState;
    if (Object.prototype.toString.call(config) === "[object Array]") {
        middlewares = config;
    } else if (typeof config === "object") {
        middlewares = config["middlewares"] || middlewares;
        callback = config["afterCreateStore"];
        initialState = config["initialState"];
    }
    return { middlewares, callback, initialState };
};

const configureStore = config => reducer => {
    let { middlewares, callback, initialState } = getMiddlewareConfig(config);

    let store = createStore(
        composeReducer(reducer),
        initialState,
        applyMiddleware(...middlewares)
    );
    callback && callback(store);
    return store;
};

export default configureStore(appConfig);
