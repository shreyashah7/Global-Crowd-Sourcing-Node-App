import React, { Component } from 'react';
import './login.css';
import PropTypes from 'prop-types';

class Login extends Component {

    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            submitted: false
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    static propTypes = {
        handleLogin: PropTypes.func.isRequired
    };


    // freelancer-app:comment - Initializing the state variables used in forms
    componentWillMount() {
        this.setState({
            email: '',
            password: '',
            submitted: false
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        this.setState({ submitted: true });
        const { email, password } = this.state;
        // const { dispatch } = this.props;
        if (email && password) {
            this.props.handleLogin(this.state);
        }
    }

    render() {
        return (
            <div>
                <div className="container">
                    <div className="info">
                        <h1>Login</h1>
                    </div>
                </div>
                <div className="form">
                    <div className="thumbnail img-div">
                        <img alt="Logo unavailable" src={require('./logo.jpg')} />
                    </div>
                    <form name="form" className="login-form" onSubmit={this.handleSubmit}>
                        <div className={(this.state.submitted && !this.state.email ? ' has-error' : '')}>
                            <input type="text"
                                placeholder="Email"
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
                        <button>Login</button>
                        <p className="message">Not registered?
                                <a href="/signup">Create an account</a>
                        </p>
                    </form>
                </div>
            </div>
        );
    }
}

export default Login; 