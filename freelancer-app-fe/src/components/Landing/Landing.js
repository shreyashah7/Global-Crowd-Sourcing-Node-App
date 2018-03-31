import React, { Component } from 'react';
import Header from '../header/Header';
import '../dashboard/dashboard.css';
import LandingContent from './landingcontent';

class Landing extends Component {

    render() {
        return (
            <div>
                <Header/>
                <LandingContent />
            </div>
        );
    }
}

export default Landing;