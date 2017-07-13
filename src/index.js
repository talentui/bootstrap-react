import React from "react";
import { render } from "react-dom";
import { HashRouter as Router, Route } from "react-router-dom";
import { Provider } from "react-redux";
import composeReducer from "./compose-reducers";
import config from '&/app-config';

//import from local file
import PageProxy from "./page-proxy";
import configureStore from "./configure-store";

import reducer from "&/reducers";

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

    module.hot.accept("reducers", () => {
        let reducer = require("reducers").default;
        store.replaceReducer(composeReducer(reducer));
    });
}
