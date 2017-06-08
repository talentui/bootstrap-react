import React, { Component } from "react";
import PageProxy from './page-proxy';
import { HashRouter as Router, Route, Link } from "react-router-dom";

export default class TalentUIBootstrap extends Component {
    
    render() { 
        let { app, loader } = this.props;
        app;
        return (
            <Router>
                <div className="container">
                    {React.createElement(
                        app,
                        null,
                        <Route path="*" render={props => <PageProxy loader={loader} {...props} />} />
                    )}
                </div>
            </Router>
        );
    }
}
