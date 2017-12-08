import React, { Component } from "react";
import App from "_/src/entry";

const tabPattern = "/~/";
const currentPage = "$$currentPage";
const df = "default";

class PageProxy extends Component {
    state = {};

    getPagePath(props) {
        let { match: { url } } = props || this.props;
        let path = url.substr(1) || "home";
        return path.split(tabPattern);
    }

    componentWillMount() {
        this.loadAsyncPages(this.getPagePath());
    }

    isPathChange(path1, path2) {
        let l1 = path1.length;
        let l2 = path2.length;
        if (l1 !== l2) {
            return true;
        } else {
            let i;
            for (i = 0; i < l1.length; i++) {
                if (l1[i] !== l2[i]) {
                    return true;
                }
            }
        }
        return false;
    }

    componentWillReceiveProps(nextProps) {
        let currentPath = this.getPagePath();
        let nextPath = this.getPagePath(nextProps);
        if ((currentPath, nextPath)) {
            this.loadAsyncPages(nextPath);
        }
    }

    renderTabElement(tabPaths, pagePath) {
        let tabArray = this.getTabPathArray(tabPaths, pagePath);
        return tabArray.reduceRight((element, oneTabPath) => {
            let TabClass = this.state[oneTabPath];
            if (!TabClass) {
                return null;
            }
            let tabName= oneTabPath.split('/').pop();
            if (element) {
                return React.cloneElement(<TabClass _tabName={tabName} />, null , element);
            } else {
                return <TabClass _tabName={tabName}/>;
            }
        }, null);
    }

    renderPageElement() {
        let { state } = this;
        let [pagePath, tabPath] = this.getPagePath();
        let PageComponent = state[pagePath];
        let pageElement = !!PageComponent ? (
            <PageComponent {...this.props} />
        ) : (
            <div>loading...</div>
        );
        let tabElement = null;
        if (tabPath) {
            tabElement = this.renderTabElement(tabPath, pagePath);
        }
        return React.cloneElement(pageElement, {}, tabElement);
    }

    render() {
        let pageElement = this.renderPageElement();
        return <App {...this.props}>{pageElement}</App>;
    }

    getTabPathArray(tabPath = "", pagePath="") {
        let tabArray = [];
        let tempTabRecord = "";
        tabPath.split("/").forEach((item, index) => {
            tempTabRecord += index === 0 ? item : `/${item}`;
            tabArray.push(`${pagePath}/${tempTabRecord}`);
        });
        return tabArray;
    }

    warn(msg, err) {
        console && console.log && console.log(msg, err)
    }

    loadAsyncPages(path) {
        let pagePath = path[0];
        let tabPath = path[1];
        let loadTabs = [],
            tabsArray = tabPath ? this.getTabPathArray(tabPath, pagePath) : [],
            loadPage = this.state[pagePath]
                ? false
                : import(/* webpackMode: "lazy", webpackChunkName: "[request]" */ `_/src/pages/${pagePath}/page-view`);
        if (tabPath) {
            loadTabs = tabsArray.map(item => {
                if (!this.state[item]) {
                    return import(/* webpackMode: "lazy-once", webpackChunkName: "tabs" */ `_/src/pages/${item}/tab-view`);
                } else {
                    return this.state[item];
                }
            });
        }
        Promise.all([loadPage]).then(([PageComponent]) => {
            let needUpdate = false;
            let updateData = {};
            if(PageComponent) {
                needUpdate = true;
                updateData[pagePath] = PageComponent[df];
            }
            if(this.state[currentPage] !== pagePath) {
                needUpdate = true;
                updateData[currentPage] = pagePath;
            }
            if(needUpdate) {
                this.setState(updateData);
            }
            Promise.all(loadTabs)
                .then(tabViews => {
                    tabViews.forEach((tabview, index) => {
                        let tabPath = tabsArray[index];
                        if (!this.state[tabPath]) {
                            this.setState({
                                [tabPath]: tabview[df]
                            });
                        }
                    });
                })
                .catch(err => {
                    this.warn(`加载 ${pagePath} 页面下的Tab ${tabPath} 失败`, err)
                });
        }).catch(err => {
            this.warn(`页面 ${pagePath} 加载失败`, err)
        });
    }
}

export default PageProxy;