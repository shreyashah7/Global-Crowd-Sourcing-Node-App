import React, { Component } from 'react';
import * as API from '../../api/API';
import { ToastContainer, toast } from 'react-toastify';
import * as UserHelper from '../_helper/helper';
import './payment.css';

class AddMoney extends Component {

    notify = (message) => toast(message);

    constructor(props) {
        super(props);

        this.state = {
            depositAmount: 30,
            creditCardNumber: '',
            expiration: '',
            cardCvv: '',
            zipcode: '',
            cardSubmitted: false,
            invalidCreditCardNumber: false,
            invalidExpiration: false,
            invalidCardCvv: false,
            invalidZipcode: false,
            user: UserHelper.getUserObject()
        };
        this.handleCardDetails = this.handleCardDetails.bind(this);
    }

    handleCardDetails(e) {
        e.preventDefault();
        this.setState({
            cardSubmitted: true
        });
        if (!UserHelper.validateCardNumber(this.state.creditCardNumber)) {
            this.setState({
                invalidCreditCardNumber: true
            });
        } else {
            this.setState({
                invalidCreditCardNumber: false
            })
        }
        if (!UserHelper.validateExpiration(this.state.expiration)) {
            this.setState({
                invalidExpiration: true
            });
        } else {
            this.setState({
                invalidExpiration: false
            })
        }
        if (!UserHelper.validateCardCvv(this.state.cardCvv)) {
            this.setState({
                invalidCardCvv: true
            });
        } else {
            this.setState({
                invalidCardCvv: false
            });
        }
        if (UserHelper.validateCardCvv(this.state.cardCvv) && UserHelper.validateCardNumber(this.state.creditCardNumber) && UserHelper.validateExpiration(this.state.expiration)) {
            let projectObj = {};
            projectObj.projectId = null;
            projectObj.senderId = this.state.user._id;
            projectObj.receiverId = this.state.user._id;
            projectObj.amount = Number(this.state.depositAmount) + 0.99;
            projectObj.type = 'CREDIT';
            API.savePaymentDetails(projectObj)
                .then((resultData) => {
                    if (resultData.data !== undefined && resultData.data !== null) {
                        let userObj = this.state.user;
                        userObj.totalMoney = Number(userObj.totalMoney) + Number(this.state.depositAmount);
                        this.setState({
                            user: userObj
                        })
                        UserHelper.setUserObject(userObj);
                        this.setState({
                            depositAmount: 30,
                            creditCardNumber: '',
                            expiration: '',
                            cardCvv: '',
                            zipcode: '',
                            cardSubmitted: false,
                            invalidCreditCardNumber: false,
                            invalidExpiration: false,
                            invalidCardCvv: false,
                            invalidZipcode: false
                        });
                        this.notify(resultData.meta.message);
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
                            <div className="form-group col-md-12">
                                <div className="col-md-7 pd-left-0">
                                    <h1><b>Select a Payment Method</b></h1>
                                </div>
                                <div className="col-md-4">
                                    <img className="payment-logo pull-right" src={require('../../../src/Freelancer_logo.png')} alt="Not Available" />
                                </div>
                            </div>
                        </section>
                        <section>
                            <div className="form-group col-md-12">
                                <div className="col-md-6 pd-left-0">
                                    <div className="panel panel-primary panel-default">
                                        <div className="panel-heading">
                                            <h3 className="panel-title">Credit or Debit Card</h3>
                                        </div>
                                        <div className="panel-body">
                                            <form role="form" id="payment-form" method="POST" action="javascript:void(0);">
                                                <div className="row">
                                                    <div className="col-xs-12">
                                                        <div className="form-group">
                                                            <label htmlFor="cardNumber">CARD NUMBER</label>
                                                            <div className={(this.state.cardSubmitted && (!this.state.creditCardNumber || this.state.invalidCreditCardNumber) ? ' has-error' : '')}>
                                                                <div className="input-group">
                                                                    <input
                                                                        type="tel"
                                                                        className="form-control"
                                                                        name="cardNumber"
                                                                        placeholder="Valid Card Number"
                                                                        autoComplete="cc-number"
                                                                        required autoFocus
                                                                        value={this.state.creditCardNumber}
                                                                        onChange={(event) => {
                                                                            this.setState({ creditCardNumber: event.target.value })
                                                                        }}
                                                                    />
                                                                    <span className="input-group-addon">
                                                                        <i className="fa fa-credit-card"></i>
                                                                    </span>
                                                                </div>
                                                                {this.state.cardSubmitted && (!this.state.creditCardNumber || this.state.invalidCreditCardNumber) &&
                                                                    <div className="help-block">Credit Card Number is invalid</div>
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-xs-7 col-md-7">
                                                        <div className="form-group">
                                                            <label htmlFor="cardExpiry">
                                                                <span className="hidden-xs">EXPIRATION</span>
                                                                <span className="visible-xs-inline">EXP</span> DATE</label>
                                                            <div className={(this.state.cardSubmitted && (!this.state.expiration || this.state.invalidExpiration) ? ' has-error' : '')}>
                                                                <input
                                                                    type="tel"
                                                                    className="form-control"
                                                                    name="cardExpiry"
                                                                    placeholder="MM / YY"
                                                                    autoComplete="cc-exp"
                                                                    required
                                                                    value={this.state.expiration}
                                                                    onChange={(event) => {
                                                                        this.setState({ expiration: event.target.value })
                                                                    }}
                                                                />
                                                                {this.state.cardSubmitted && (!this.state.expiration || this.state.invalidExpiration) &&
                                                                    <div className="help-block">Card Expiration is invalid</div>
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-xs-5 col-md-5 pull-right">
                                                        <div className="form-group">
                                                            <label htmlFor="cardCVC">CV CODE</label>
                                                            <div className={(this.state.cardSubmitted && (!this.state.cardCvv || this.state.invalidCardCvv) ? ' has-error' : '')}>
                                                                <input
                                                                    type="tel"
                                                                    className="form-control"
                                                                    name="cardCVC"
                                                                    placeholder="CVC"
                                                                    autoComplete="cc-csc"
                                                                    required
                                                                    value={this.state.cardCvv}
                                                                    onChange={(event) => {
                                                                        this.setState({ cardCvv: event.target.value })
                                                                    }}
                                                                />
                                                                {this.state.cardSubmitted && (!this.state.cardCvv || this.state.invalidCardCvv) &&
                                                                    <div className="help-block">Card CVV is invalid</div>
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-xs-12">
                                                        <div className="form-group">
                                                            <label htmlFor="cardNumber">Billing Zipcode</label>
                                                            <div className={(this.state.cardSubmitted && (!this.state.zipcode || this.state.invalidZipcode) ? ' has-error' : '')}>
                                                                <div className="input-group">
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        name="zipcode"
                                                                        placeholder="Zipcode"
                                                                        required autoFocus
                                                                        value={this.state.zipcode}
                                                                        onChange={(event) => {
                                                                            this.setState({ zipcode: event.target.value })
                                                                        }}
                                                                    />
                                                                </div>
                                                                {this.state.cardSubmitted && (!this.state.zipcode || this.state.invalidZipcode) &&
                                                                    <div className="help-block">Zipcode is invalid</div>
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-xs-12">
                                                        <img alt="Card Not Availbale" className="img-responsive"
                                                            src="http://i76.imgup.net/accepted_c22e0.png" />
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-xs-12">
                                                        <p className="payment-errors"></p>
                                                    </div>
                                                </div>
                                            </form>

                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-5">
                                    <div className="panel panel-default">
                                        <div className="panel-body">
                                            <div className="form-group col-md-12">
                                                <div className="col-md-6 pd-t-10">
                                                    <span><b>Deposit Currency</b></span>
                                                </div>
                                                <div className="col-md-6">
                                                    <select className="form-control project-input"
                                                        id="jobCurrency"
                                                        name="jobCurrency">
                                                        <option value="USD">USD</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="form-group col-md-12 border-top">
                                                <div className="col-md-6 pd-t-20">
                                                    <span>Deposit Amount</span>
                                                </div>
                                                <div className="col-md-6 pd-t-10">
                                                    <div className="input-group">
                                                        <span className="input-group-addon">$</span>
                                                        <input type="text"
                                                            className="form-control"
                                                            value={this.state.depositAmount}
                                                            onChange={(event) => {
                                                                this.setState({ depositAmount: event.target.value })
                                                            }} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form-group col-md-12 pd-t-10">
                                                <div className="col-md-6">
                                                    <span>Processing Fee</span>
                                                </div>
                                                <div className="col-md-5">
                                                    <span className="pull-right">0.99</span>
                                                </div>
                                                <div className="col-md-1">
                                                    <span className="pull-right">USD</span>
                                                </div>
                                            </div>
                                            <div className="form-group col-md-12 pd-t-10 border-top">
                                                <div className="col-md-6">
                                                    <span><b>Total</b></span>
                                                </div>
                                                <div className="col-md-5">
                                                    <span className="pull-right">{Number(this.state.depositAmount) + Number(0.99)}</span>
                                                </div>
                                                <div className="col-md-1">
                                                    <span className="pull-right">USD</span>
                                                </div>
                                            </div>
                                            <div className="col-md-12">
                                                <button className="btn btn-primary btn-lg btn-block"
                                                    type="button"
                                                    onClick={(e) => this.handleCardDetails(e)}>
                                                    Confirm ${Number(this.state.depositAmount) + Number(0.99)} USD</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </form>
                </div>
            </div>
        )
    }

}

export default AddMoney;