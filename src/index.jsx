import React from "react";
import { render } from "react-dom";
import { HashRouter as Router, Route } from "react-router-dom";
import { Provider } from "react-redux";
import composeReducer from "./compose-reducers";
import config from '_/src/app-config';

//import from local file
import PageProxy from "./page-proxy";
import configureStore from "./configure-store";

import reducer from "_/src/reducers";

let store = configureStore(reducer);
let mountTarget = config.el || 'bsMain';

if(typeof(mountTarget) === 'string'){
    mountTarget = document.getElementById(mountTarget);
}

const bootstrap = node => {
    render(
        <Provider store={store}>
            <Router>
                <Route path="*" component={PageProxy} />
            </Router>
        </Provider>,
        node
    );
};

bootstrap(mountTarget);

if (module.hot) {
    module.hot.accept("./page-proxy", () => {
        bootstrap(mountTarget);
    });

    module.hot.accept("_/src/reducers", () => {
        let reducer = require("_/src/reducers").default;
        store.replaceReducer(composeReducer(reducer));
    });
}
