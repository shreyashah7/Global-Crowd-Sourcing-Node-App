import React, { Component } from 'react';
import './App.css';
import { BrowserRouter, Route, Redirect } from 'react-router-dom';
import Landing from './components/Landing/Landing';
import UserProfile from './components/user/updateprofile';
import Dashboard from './components/dashboard/Dashboard';
import PostProject from './components/projects/Postproject';
import ViewProject from './components/projects/Viewproject';
import ListProject from './components/projects/Listprojects';
import SearchProjects from './components/projects/Searchprojects';
import ViewUserProfile from './components/user/Userprofile';
import * as UserHelper from './components/_helper/helper';
import MainHeader from './components/header/MainHeader';

class App extends Component {
  state = {
    isLoggedIn: UserHelper.getLoggedInStatus(),
    routeChanged: '/dashboard'
  }

  render() {
    const isLoggedIn = this.state.isLoggedIn;
    return (
      <BrowserRouter>
        <div>
          <Route path="/editprofile" render={(props) => (
            UserHelper.getLoggedInStatus() ? (
              <div>
                <MainHeader />
                <UserProfile {...props} />
              </div>
            ) : (
                <Redirect to="/" component={Landing} />
              )
          )} />
          <Route path="/dashboard" render={(props) => (
            UserHelper.getLoggedInStatus() ? (
              <div>
                <MainHeader />
                <Dashboard {...props} />
              </div>

            ) : (
                <Redirect to="/" component={Landing} />
              )
          )} />
          <Route path="/post-project" render={(props) => (
            UserHelper.getLoggedInStatus() ? (
              <div>
                <MainHeader />
                <PostProject {...props} />
              </div>
            ) : (
                <Redirect to="/" component={Landing} />
              )
          )} />
          <Route path="/viewproject/:projectId" render={(props) => (
            UserHelper.getLoggedInStatus() ? (
              <div>
                <MainHeader />
                <ViewProject {...props} />
              </div>
            ) : (
                <Redirect to="/" component={Landing} />
              )
          )} />
          <Route path="/listprojects/:status" render={(props) => (
            UserHelper.getLoggedInStatus() ? (
              <div>
                <MainHeader />
                <ListProject {...props} />
              </div>
            ) : (
                <Redirect to="/" component={Landing} />
              )
          )} />
          <Route path="/searchprojects/:searchStrng" render={(props) => (
            UserHelper.getLoggedInStatus() ? (
              <div>
                <MainHeader />
                <SearchProjects {...props} />
              </div>
            ) : (
                <Redirect to="/" component={Landing} />
              )
          )} />
          <Route path="/" render={(props) => (
            UserHelper.getLoggedInStatus() ? (
              <Redirect to={this.props.location ? this.props.location : '/dashboard'} component={Landing} />
            ) : (
                <Landing {...props} />
              )
          )} />
          <Route path="/userprofile/:userId" render={(props) => (
            UserHelper.getLoggedInStatus() ? (
              <div>
                <MainHeader />
                <ViewUserProfile {...props} />
              </div>
            ) : (
                <Redirect to="/" component={Landing} />
              )
          )} />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
