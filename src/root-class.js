import React, { Component } from "react";
import PageProxy from './page-proxy';
import { HashRouter as Router, Route, Link } from "react-router-dom";
import App from "entry";

export default class TalentUIBootstrap extends Component {
    
    render() { 
        return (
            <Router>
                <div className="container">
                    {React.createElement(
                        App,
                        null,
                        <Route path="*" render={props => <PageProxy  {...props} />} />
                    )}
                </div>
            </Router>
        );
    }
}
