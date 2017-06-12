import React, { Component } from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import TalentUIBootstrap from "./root-class";
import configureStore from "./configure-store";
import reducer from "reducers";

let store = configureStore(reducer);

const r = () => {
    render(
        <Provider store={store}>
            <TalentUIBootstrap  />
        </Provider>,
        document.getElementById("bsMain")
    );
};

r();

if(module.hot){
    module.hot.accept('./root-class', ()=>{
        r();
    })
}
