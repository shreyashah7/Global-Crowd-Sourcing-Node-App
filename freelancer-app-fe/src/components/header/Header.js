import React, { Component } from 'react';
import { Route, withRouter } from 'react-router-dom';
import './header.css';
import Login from "../registration/Login";
import Signup from "../registration/Signup";
import * as API from '../../api/API';
import { ToastContainer, toast } from 'react-toastify';
import * as UserHelper from '../_helper/helper';

class Header extends Component {

  notify = (message) => toast(message);

  state = {
    isLoggedIn: false,
    message: '',
    user: {}
  };

  // freelancer-app:comment - Server call for login
  handleLogin = (formdata) => {
    delete formdata.submitted;
    API.login(formdata)
      .then((resultData) => {
        if (resultData.data !== undefined && resultData.data !== null) {
          this.setState({
            isLoggedIn: true,
            message: resultData.message,
            user: resultData.data,
          });
          UserHelper.setUserObject(resultData.data);
          UserHelper.setLoggedInStatus(true);
          this.props.history.push("/dashboard");
        } else {
          this.setState({
            isLoggedIn: false,
            message: resultData.message,
          });
          this.notify(resultData.message);
        }
      }).catch(error => {
        console.log("error :",error);
        this.notify(error.message);
      });
  };

  // freelancer-app:comment - Signup server API call to register user
  handleSignUp = (formdata) => {
    delete formdata.submitted;
    API.signUp(formdata)
      .then((resultData) => {
        if (resultData.data !== undefined && resultData.data !== null) {
          this.setState({
            isLoggedIn: false,
            message: resultData.message
          });
          this.props.history.push("/login");
        } else {
          this.notify(resultData.message);
          this.setState({
            isLoggedIn: false,
            message: resultData.message,
          });
        }
      }).catch(error => {
        this.notify(error.message);
      });
  };

  render() {
    return (
      <div className="container-fluid" id="outer-container">
        <ToastContainer />
        <Route exact path="/" render={() => (
          <nav className="navbar navbar-default app-header main-header">
            <div className="container-fluid">
              <div className="navbar-header">
                <button type="button"
                  className="navbar-toggle collapsed"
                  data-toggle="collapse"
                  data-target="#bs-example-navbar-collapse-1"
                  aria-expanded="false">
                  <span className="sr-only">Toggle navigation</span>
                  <span className="icon-bar"></span>
                  <span className="icon-bar"></span>
                  <span className="icon-bar"></span>
                </button>
                <a className="navbar-brand" href="/">Freelancer</a>
              </div>
              <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                <ul className="nav navbar-nav">
                  <li className="dropdown">
                    <a href="" className="dropdown-toggle"
                      data-toggle="dropdown"
                      role="button"
                      aria-haspopup="true"
                      aria-expanded="false">Hire Freelancers <span className="caret"></span>
                    </a>
                    <ul className="dropdown-menu">
                      <li><a href="">Post a Project</a></li>
                      <li><a href="">Post a Content</a></li>
                      <li><a href="">Post a Local job</a></li>
                      <li role="separator" className="divider">DISCOVER</li>
                      <li><a href="">Showcase</a></li>
                      <li><a href="">Browse Directory</a></li>
                      <li><a href="">Community</a></li>
                    </ul>
                  </li>
                  <li className="dropdown">
                    <a href="" className="dropdown-toggle"
                      data-toggle="dropdown"
                      role="button"
                      aria-haspopup="true"
                      aria-expanded="false">Find Work <span className="caret"></span></a>
                    <ul className="dropdown-menu">
                      <li><a href="">Browse Projects</a></li>
                      <li><a href="">Browse Contents</a></li>
                      <li><a href="">Browse Categories</a></li>
                    </ul>
                  </li>
                  <li><a href="">How It Works <span className="sr-only">(current)</span></a></li>
                </ul>
                <ul className="nav navbar-nav navbar-right">
                  <li><a href="" onClick={() => {
                    this.props.history.push("/login");
                  }}>Log In</a></li>
                  <li><a href="" onClick={() => {
                    this.props.history.push("/signup");
                  }}>Sign Up</a></li>
                  <button className="btn btn-primary btn-small post-project" type="button">Post a Project</button>
                </ul>
              </div>
            </div>
          </nav>
        )} />
        <Route exact path="/login" render={() => (
          <div>
            <div>
              <Login handleLogin={this.handleLogin} />
            </div>
          </div>
        )} />
        <Route exact path="/signup" render={() => (
          <div>
            <Signup handleSignUp={this.handleSignUp} />
          </div>
        )} />
      </div>
    );
  }
}

export default withRouter(Header);