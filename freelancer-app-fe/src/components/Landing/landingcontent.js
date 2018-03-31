import React, { Component } from 'react';
import './landing.css';
import { Route } from 'react-router-dom';

class LandingContent extends Component {

    render() {
        return (
            <div>
                <Route exact path="/" render={() => (
                    <div className="main-body">
                        <section className="clearfix landing-content">
                            <div className="container-fluid">
                                <div className="row col-md-offset-2">
                                    <div className="col-sm-3 mr-right-0">
                                        <div className="custom-card text-center">
                                            <div className="title">
                                                <i className="fa fa-paper-plane" aria-hidden="true"></i>
                                                <h2>Basic</h2>
                                            </div>
                                            <div className="price">
                                                <h4><sup>$</sup>0 - Free</h4>
                                            </div>
                                            <div className="option">
                                                <ul>
                                                    <li> <i className="fa fa-check" aria-hidden="true"></i> 5 Project Space </li>
                                                    <li> <i className="fa fa-check" aria-hidden="true"></i> Limited Chat Box </li>
                                                    <li> <i className="fa fa-check" aria-hidden="true"></i> 7% Fee </li>
                                                    <li> <i className="fa fa-times" aria-hidden="true"></i> Live Support </li>
                                                </ul>
                                            </div>
                                            <a href="javascript:void(0);">Order Now </a>
                                        </div>
                                    </div>

                                    <div className="col-sm-3 mr-right-0">
                                        <div className="custom-card text-center">
                                            <div className="title">
                                                <i className="fa fa-plane" aria-hidden="true"></i>
                                                <h2>Standard</h2>
                                            </div>
                                            <div className="price">
                                                <h4><sup>$</sup>50</h4>
                                            </div>
                                            <div className="option">
                                                <ul>
                                                    <li> <i className="fa fa-check" aria-hidden="true"></i> 25 Project Space </li>
                                                    <li> <i className="fa fa-check" aria-hidden="true"></i> Unlimited Chat Box</li>
                                                    <li> <i className="fa fa-check" aria-hidden="true"></i> 5% Fee </li>
                                                    <li> <i className="fa fa-times" aria-hidden="true"></i> Live Support </li>
                                                </ul>
                                            </div>
                                            <a href="javascript:void(0);">Order Now </a>
                                        </div>
                                    </div>

                                    <div className="col-sm-3 mr-right-0">
                                        <div className="custom-card text-center">
                                            <div className="title">
                                                <i className="fa fa-rocket" aria-hidden="true"></i>
                                                <h2>Premium</h2>
                                            </div>
                                            <div className="price">
                                                <h4><sup>$</sup>100</h4>
                                            </div>
                                            <div className="option">
                                                <ul>
                                                    <li> <i className="fa fa-check" aria-hidden="true"></i> Unlimited Project Space </li>
                                                    <li> <i className="fa fa-check" aria-hidden="true"></i> Unlimited Chat Box </li>
                                                    <li> <i className="fa fa-check" aria-hidden="true"></i> 3% Fee </li>
                                                    <li> <i className="fa fa-check" aria-hidden="true"></i> Live Support </li>
                                                </ul>
                                            </div>
                                            <a href="javascript:void(0);">Order Now </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                )} />
            </div>

        );
    }
}

export default LandingContent;