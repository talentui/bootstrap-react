import React, { Component } from 'react';

const currentPage = '$$currentPage';
const df = 'default';

export default class PageProxy extends Component {
  state = { hasError: false };

  getPagePath(props) {
    let {
      match: { url }
    } = props || this.props;
    return url.substr(1) || 'home';
  }

  componentDidMount() {
    this.loadAsyncPages(this.getPagePath(this.props));
  }

  componentWillReceiveProps(nextProps) {
    let currentPath = this.getPagePath(this.props);
    let nextPath = this.getPagePath(nextProps);
    if (currentPath !== nextPath) {
      this.loadAsyncPages(nextPath);
    }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(err, info) {
    this.warn('哎呀，出错了');
    this.warn(info.componentStack);
  }

  renderPageElement(props, Loading) {
    let { state } = this;
    let Page = state[this.getPagePath(this.props)];
    if (Page) {
      let { useLayout } = Page;
      this.useLayout = typeof useLayout === 'boolean' ? useLayout : true; //缓存当前useLayout的状态，进入下一个页面的时候避免发生layout的切换导致的闪动
      return [<Page {...this.props} />, this.useLayout];
    }
    //读取之前的layout状态，如果不存在就用true
    let ul = this.useLayout === 'boolean' ? this.useLayout : true;
    return [Loading ? <Loading /> : <div>加载中...</div>, ul];
  }

  render() {
    let { ErrorComp, Layout, LoadingComp, ...props } = this.props;
    if (this.state.hasError && ErrorComp) return <ErrorComp />;
    let [pageElement, useLayout] = this.renderPageElement(props, LoadingComp);
    if (!useLayout || !Layout) return pageElement;
    return <Layout {...this.props}>{pageElement}</Layout>;
  }

  warn(msg, err) {
    if (console && console.error) {
      console.error(msg);
      if (err) throw err;
    }
  }

  loadAsyncPages(path) {
    let loadPage = this.state[path]
      ? undefined
      : import(/* webpackMode: "lazy", webpackChunkName: "[request]" */ `_/src/pages/${path}/page-view`);
    Promise.all([loadPage])
      .then(([PageComponent]) => {
        let needUpdate = false;
        let updateData = {};
        if (PageComponent) {
          needUpdate = true;
          updateData[path] = PageComponent[df];
        }
        if (this.state[currentPage] !== path) {
          needUpdate = true;
          updateData[currentPage] = path;
        }
        if (needUpdate) {
          this.setState(updateData);
        }
      })
      .catch(err => {
        this.warn(`页面 ${path} 加载失败`, err);
      });
  }
}
