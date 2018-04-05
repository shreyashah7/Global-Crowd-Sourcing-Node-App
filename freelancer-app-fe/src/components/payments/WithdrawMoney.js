import React, { Component } from 'react';
import * as API from '../../api/API';
import { ToastContainer, toast } from 'react-toastify';
import * as UserHelper from '../_helper/helper';
import './payment.css';

class WithdrawMoney extends Component {

    notify = (message) => toast(message);

    constructor(props) {
        super(props);

        this.state = {
            email: '',
            withdrawAmount: 0,
            submitted: false,
            user: UserHelper.getUserObject()
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        this.setState({
            submitted: true
        });
        if (!!this.state.email && !!this.state.withdrawAmount) {
            let projectObj = {};
            projectObj.projectId = null;
            projectObj.senderId = this.state.user._id;
            projectObj.receiverId = this.state.user._id;
            projectObj.amount = this.state.withdrawAmount;
            projectObj.type = 'DEBIT';
            API.savePaymentDetails(projectObj)
                .then((resultData) => {
                    if (resultData.data !== undefined && resultData.data !== null) {
                        let userObj = this.state.user;
                        userObj.totalMoney = Number(userObj.totalMoney) - Number(this.state.withdrawAmount);
                        this.setState({
                            user: userObj
                        })
                        UserHelper.setUserObject(userObj);
                        this.setState({
                            submitted: false,
                            email: '',
                            withdrawAmount: 0
                        });
                        this.notify("Amount Withdrawn Successfully");
                    } else {
                        this.notify(resultData.message);
                    }
                }).catch(error => {
                    this.notify(error);
                });
        }
    }

    render() {
        return (
            <div className="col-md-12 main-content">
                <ToastContainer />
                <div className="col-md-offset-1 col-md-10">
                    <form name="form" className="login-form" onSubmit={this.handleSubmit}>
                        <section>
                            <div className="col-md-12">
                                <div className="col-md-7 pd-left-0">
                                    <h1><b>PayPal Withdrawal</b></h1>
                                </div>
                            </div>
                        </section>
                        <section>
                            <div className="well white-color clearfix">
                                <div className="col-md-12 pd-left-0">
                                    <div className="col-md-8 pd-left-0">
                                        <div className="col-md-8 pd-left-0 mr-t-10">
                                            <h4><b>PayPal Email Account</b></h4>
                                            <div className={(this.state.submitted && !this.state.email ? ' has-error' : '')}>
                                                <input type="text"
                                                    placeholder="e.g. Paypal Account Email"
                                                    className="form-control withdrawal-input"
                                                    id="email"
                                                    name="email"
                                                    value={this.state.email}
                                                    onChange={(event) => {
                                                        this.setState({ email: event.target.value })
                                                    }} />
                                                {this.state.submitted && !this.state.email &&
                                                    <div className="help-block">Email is required</div>
                                                }
                                            </div>
                                        </div>
                                        <div className="col-md-8 pd-left-0 mr-t-10">
                                            <div className="pd-left-0">
                                                <h4><b>Amount to withdraw</b></h4>
                                                <div className="form-group row" className={(this.state.submitted && !this.state.withdrawAmount ? ' has-error' : '')}>
                                                    <div className="col-md-6  pd-left-0">
                                                        <select className="form-control withdrawal-input"
                                                            id="jobCurrency"
                                                            name="jobCurrency">
                                                            <option value="USD">USD</option>
                                                        </select>
                                                    </div>
                                                    <div className="input-group col-md-6">
                                                        <span className="input-group-addon input-grp">$</span>
                                                        <input type="number"
                                                            className="form-control withdrawal-input"
                                                            value={this.state.withdrawAmount}
                                                            onChange={(event) => {
                                                                this.setState({ withdrawAmount: event.target.value })
                                                            }} />
                                                    </div>
                                                    <div className="col-md-12 pd-left-0 mr-t-10">
                                                        <span>Note: Min amount $30 USD. Max amount $10000 USD</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-4 mr-t-10 receive-para">
                                        <div className="mr-t-10 fs-16">
                                            <span> You will receive: </span>
                                        </div>
                                        <div className="mr-t-10 fs-16">
                                            <span><b>{'$' + this.state.withdrawAmount}</b></span>
                                        </div>
                                        <div className="mr-t-10">
                                            <span>Note: There is no withdrawal fee</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-2 pd-left-0 mr-t-10">
                                    <button className="btn btn-primary btn-lg"
                                        type="button" onClick={(e) => this.handleSubmit(e)}>Withdraw Funds</button>
                                </div>
                            </div>
                        </section>
                    </form>
                </div>
            </div>
        )
    }
}

export default WithdrawMoney;