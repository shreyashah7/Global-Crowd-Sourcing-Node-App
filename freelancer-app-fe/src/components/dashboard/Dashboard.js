import React, { Component } from 'react';
import './dashboard.css';
import MainContent from '../content/MainContent';
import RightContent from '../content/Rightcontent';

class Dashboard extends Component {
    render() {
        return (
            <div className="main-body">
                <div className="col-md-12 main-content">
                    <MainContent />
                    <RightContent />
                </div>
            </div>
        );
    }
}

export default Dashboard;
