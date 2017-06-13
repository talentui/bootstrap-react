//import from node_modules
import React from "react";
import { render } from "react-dom";
import { HashRouter as Router, Route } from "react-router-dom";
import { Provider } from "react-redux";
import composeReducer from "./compose-reducers";

//import from local file
import PageProxy from "./page-proxy";
import configureStore from "./configure-store";

// import from project
import reducer from "reducers";

let store = configureStore(reducer);

const bootstrap = () => {
    render(
        <Provider store={store}>
            <Router>
                <Route path="*" render={props => <PageProxy {...props} />} />
            </Router>
        </Provider>,
        document.getElementById("bsMain")
    );
};

bootstrap();

if (module.hot) {
    module.hot.accept("./page-proxy", () => {
        bootstrap();
    });

    module.hot.accept("reducers", () => {
        let reducer = require("reducers").default;
        store.replaceReducer(composeReducer(reducer));
    });
}
