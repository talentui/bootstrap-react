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
   * @param {function | object} options.reducer - redux reducer 必须
   * @param {string | HTMLElement} options.el - 应用的挂载点 可选
   * @param {function} options.afterCreateStore - 创建完store之后的回调 可选
   * @param {reduxMiddleware[]} options.middlewares - redux中间件 可选
   * @param {ReactComponent} options.layout - 布局组件 可选
   * @param {ReactComponent} options.loadingComp - 加载中显示的组件 可选
   * @param {ReactComponent} options.errorComp - 出错后显示的组件 可选
   */
  config(options) {
    this.reduxStore = this.reduxStore || configureStore(options);
    this.mountTarget = this.getMountTarget(options.el);
    this.loadingComp = options.loadingComp;
    this.errorComp = options.errorComp;
    this.layout = options.layout;
  }

  replaceReducer(reducer) {
    this.reduxStore.replaceReducer(composeReducer(reducer));
  }

  start() {
    render(
      <Provider store={this.reduxStore}>
        <Router>
          <Route
            path="*"
            render={props => (
              <PageProxy
                LoadingComp={this.loadingComp}
                ErrorComp={this.errorComp}
                Layout={this.layout}
                {...props}
              />
            )}
          />
        </Router>
      </Provider>,
      this.mountTarget
    );
  }
}

const app = new Bootstrap();

export { app as default };

if (module.hot) {
  module.hot.accept('./page-proxy', () => {
    app.start();
  });
}
