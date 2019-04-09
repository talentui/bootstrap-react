import React, { Component } from 'react';

const currentPage = '$$currentPage';
const df = 'default';

export default function getPageProxy(Layout, pageLoader) {
  return class PageProxy extends Component {
    state = {};

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

    renderPageElement() {
      let { state } = this;
      let pagePath = this.getPagePath(this.props);
      let PageComponent = state[pagePath];
      return !!PageComponent ? (
        <PageComponent {...this.props} />
      ) : (
        <div>loading...</div>
      );
    }

    render() {
      let pageElement = this.renderPageElement();
      if (Layout) return <Layout {...this.props}>{pageElement}</Layout>;
      return pageElement;
    }

    warn(msg, err) {
      if(console && console.error){
        console.error(msg);
        throw err;
      };
    }

    loadAsyncPages(path) {
      let loadPage = this.state[path] ? undefined : pageLoader(path);
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
  };
}
