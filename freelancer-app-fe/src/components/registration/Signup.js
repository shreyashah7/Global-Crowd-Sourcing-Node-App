import React, { Component } from 'react';
import './login.css';
import PropTypes from 'prop-types';

class Signup extends Component {

    constructor(props) {
        super(props);

        this.state = {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            role: 1,
            submitted: false
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    static propTypes = {
        handleSignUp: PropTypes.func.isRequired
    };

    // calc-app:comment - Initializing the state variables used in forms
    componentWillMount() {
        this.setState({
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            role: 1,
            submitted: false
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        this.setState({ submitted: true });
        const { firstName, lastName, email, password } = this.state;
        if (firstName && lastName && email && password) {
            this.props.handleSignUp(this.state);
        }
    }

    render() {
        return (
            <div>
                <div className="container">
                    <div className="info header-text">
                        <h1>Register</h1>
                    </div>
                </div>
                <div className="form">
                    <div className="thumbnail img-div">
                        <img alt="Logo unavailable" src={require('./logo.jpg')} />
                    </div>
                    <form name="register-form" className="register-form" onSubmit={this.handleSubmit}>
                        <div className={(this.state.submitted && !this.state.firstName ? ' has-error' : '')}>
                            <input type="text"
                                className="form-input"
                                placeholder="First Name"
                                id="firstName"
                                name="firstName"
                                value={this.state.firstName}
                                onChange={(event) => {
                                    this.setState({
                                        firstName: event.target.value
                                    });
                                }} />
                            {this.state.submitted && !this.state.firstName &&
                                <div className="help-block">First Name is required</div>
                            }
                        </div>
                        <div className={(this.state.submitted && !this.state.lastName ? ' has-error' : '')}>
                            <input type="text"
                                placeholder="Last Name"
                                className="form-input"
                                id="lastName"
                                name="lastName"
                                value={this.state.lastName}
                                onChange={(event) => {
                                    this.setState({
                                        lastName: event.target.value
                                    });
                                }} />
                            {this.state.submitted && !this.state.lastName &&
                                <div className="help-block">Last Name is required</div>
                            }
                        </div>
                        <div className={(this.state.submitted && !this.state.email ? ' has-error' : '')}>
                            <input type="text"
                                placeholder="Email Address"
                                className="form-input"
                                id="email"
                                name="email"
                                value={this.state.email}
                                onChange={(event) => {
                                    this.setState({
                                        email: event.target.value
                                    });
                                }} />
                            {this.state.submitted && !this.state.email &&
                                <div className="help-block">Email is required</div>
                            }
                        </div>
                        <div className={(this.state.submitted && !this.state.password ? ' has-error' : '')}>
                            <input type="password"
                                placeholder="Password"
                                className="form-input"
                                id="password"
                                name="password"
                                value={this.state.password}
                                onChange={(event) => {
                                    this.setState({
                                        password: event.target.value
                                    });
                                }} />
                            {this.state.submitted && !this.state.password &&
                                <div className="help-block">Password is required</div>
                            }
                        </div>
                        <div className="form-check form-check-inline clearfix radio-div">
                            <input className="form-check-input col-md-1"
                                type="radio"
                                name="role"
                                id="employer"
                                value="1"
                                checked={this.state.role === 1}
                                onChange={(event) => {
                                    this.setState({
                                        role: Number(event.target.value)
                                    });
                                }}
                            />
                            <label className="form-check-label radio-label col-md-4" htmlFor="employer">Employer</label>
                            <input className="form-check-input col-md-1"
                                type="radio"
                                name="role"
                                id="freelancer"
                                value="2"
                                checked={this.state.role === 2}
                                onChange={(event) => {
                                    this.setState({
                                        role: Number(event.target.value)
                                    });
                                }}
                            />
                            <label className="form-check-label radio-label col-md-4" htmlFor="freelancer">Freelancer</label>
                        </div>
                        <button>REGISTER</button>
                        <p className="message">Already registered?
                                <a href="/login">Login</a>
                        </p>
                    </form>
                </div>
            </div>
        );
    }
}

export default Signup;