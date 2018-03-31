import React, { Component } from 'react';
import * as API from '../../api/API';
import userBackgroundImage from './background-user.jpg' // relative path to image
import userImage from './user.png' // relative path to image

class ViewUserProfile extends Component {

    constructor(props) {
        super(props);

        this.state = {
            user: {}
        };
    }

    componentDidMount() {
        var userId = this.props.match.params.userId;
        if (!!userId) {
            API.getUserDetails(userId)
                .then((resultData) => {
                    if (!!resultData.data) {
                        this.setState({
                            user: resultData.data
                        });
                    } else {
                        console.log("No User Details in DB");
                    }
                });
        }
    }

    render() {
        return (
            <div className="col-md-offset-2 col-md-9 container-contact  animated fadeInUp">
                <div className="row decor-default">
                    <div className="col-md-12">
                        <div className="contact">
                            <div className="controls">
                                <img src={userBackgroundImage} alt="cover" className="cover" />
                                <div className="cont">
                                    <img src={this.state.user.avatar ? this.state.user.avatar : userImage} alt="avatar" className="avatar" />
                                    <div className="name"><span className="s-text">{this.state.user.firstName + " " + this.state.user.lastName}</span></div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-4 col-md-5 col-xs-12">
                                    <div className="row">
                                        <div className="col-xs-3">
                                            Email:
                                            </div>
                                        <div className="col-xs-9">
                                            {this.state.user.email}
                                        </div>
                                        <div className="col-xs-3">
                                            Phone:
                                            </div>
                                        <div className="col-xs-9">
                                            {this.state.user.phoneNumber}
                                        </div>
                                        <div className="col-xs-3">
                                            Skills:
                                            </div>
                                        <div className="col-xs-9">
                                            {this.state.user.skills}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-8 col-md-7 col-xs-12">
                                    <p className="contact-description">{this.state.user.aboutMe}</p>
                                </div>
                            </div>
                        </div>
                        <br/>
                    </div>
                </div>
            </div>
        )
    }
}

export default ViewUserProfile;