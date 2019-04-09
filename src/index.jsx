import React from 'react';
import { render } from 'react-dom';
import { HashRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';

import getPageProxy from './page-proxy';
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

  initPageProxy(layout, pageLoader) {
    if (this.pageProxy) return this.pageProxy;
    return getPageProxy(layout, pageLoader);
  }

  /**
   *
   * @param {function | object} options.reducer - redux reducer
   * @param {string | HTMLElement} options.el - 应用的挂载点
   * @param {function} options.afterCreateStore - 创建完store之后的回调
   * @param {React.ComponentClass} options.layout - 布局组件
   * @param {function} options.pageLoader - 加载页面的方法
   */
  config(options) {
    this.reduxStore = this.reduxStore || configureStore(options);
    this.mountTarget = this.getMountTarget(options.el);
    this.pageProxy = this.initPageProxy(options.layout, options.pageLoader);
  }

  start() {
    render(
      <Provider store={this.reduxStore}>
        <Router>
          <Route path="*" component={this.pageProxy} />
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
