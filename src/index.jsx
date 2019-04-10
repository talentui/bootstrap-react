import React from 'react';
import { render } from 'react-dom';
import { HashRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import composeReducer from './compose-reducers';

import PageProxy from './page-proxy';
import configureStore from './configure-store';

class Bootstrap {
  getMountTarget(node = 'bsMain') {
    if (this.mountTarget instanceof HTMLElement) return this.mountTarget;
    if (node instanceof HTMLElement) return node;
    if (typeof node === 'string') {
      return document.querySelector(node);
    }
    throw new Error(
      '挂载点即不是dom对象，也不是querySelector可选择的字符串，请检测项目配置'
    );
  }

  /**
   *
   * @param {function | object} options.reducer - redux reducer
   * @param {string | HTMLElement} options.el - 应用的挂载点
   * @param {function} options.afterCreateStore - 创建完store之后的回调
   * @param {reduxMiddleware[]} options.middlewares - redux中间件
   */
  config(options) {
    this.reduxStore = this.reduxStore || configureStore(options);
    this.mountTarget = this.getMountTarget(options.el);
  }

  replaceReducer(reducer){
    this.reduxStore.replaceReducer(composeReducer(reducer)); 
  }

  start() {
    render(
      <Provider store={this.reduxStore}>
        <Router>
          <Route path="*" component={PageProxy} />
        </Router>
      </Provider>,
      this.mountTarget
    );
  }
}

const app = new Bootstrap();

export { app as default };

if (module.hot) {
  module.hot.accept("./page-proxy", () => {
      app.start();
  });
}
