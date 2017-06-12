import React, { Component } from "react";

const currentPage = "$$currentPage";

class PageProxy extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    getPagePath(props) {
        let { location: { pathname } } = props || this.props;
        let path = pathname.split("/")[1] || "home";
        return path;
    }

    componentWillMount() {
        this.loadAsyncPages(this.getPagePath());
    }

    componentWillReceiveProps(nextProps) {
        let currentPath = this.getPagePath();
        let nextPath = this.getPagePath(nextProps);
        if (currentPath !== nextPath && !this.state[nextPath]) {
            this.loadAsyncPages(nextPath);
        }
    }

    render() {
        let { state } = this;
        let path = this.getPagePath();
        let PageComponent = state[path];
        if (PageComponent) {
            return <PageComponent {...this.props} />;
        }
        return null;
    }

    loadAsyncPages(path){
        let loader =  import(/* webpackMode: "lazy", webpackChunkName: "[request]" */ `containers/${path}/index`);
        loader.then((Component) => {
            this.setState({
                [path]: Component['default'],
                [currentPage]: path
            })
        })
    }
}

export default PageProxy;
