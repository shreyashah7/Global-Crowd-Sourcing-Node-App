import React, { Component } from 'react';
import './maincontent.css';

class RightContent extends Component {

    render() {
        return (
            <div>
                <div className="col-md-4">
                    <div className="panel panel-success user_panel">
                        <div className="panel-heading">
                            <h3 className="panel-title">Projects Near Me</h3>
                        </div>
                        <div className="panel-body">
                            <ul className="list-group">
                                <li className="list-group-item">
                                    <a><i className="fas fa-utensils"></i> Restaurant Consultant</a>
                                    <button className="btn btn-sm btn-success pull-right">View </button>
                                    <p className="card-text mr-t-5px">
                                        <i className="fas fa-map-marker"></i> San Jose, United States (0 km away)</p>
                                </li>
                                <li className="list-group-item">
                                    <div className="card-title">
                                        <a><i className="fas fa-utensils"></i> Make a Video</a>
                                        <button className="btn btn-sm btn-success pull-right">View </button>
                                    </div>
                                    <p className="card-text mr-t-5px">
                                        <i className="fas fa-map-marker"></i> Ben Lomond, United States (32.9 km away)</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default RightContent;
