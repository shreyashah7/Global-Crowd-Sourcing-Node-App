import React, { Component } from 'react';
import './project.css';
import * as API from '../../api/API';
import * as UserHelper from '../_helper/helper';
import { ToastContainer, toast } from 'react-toastify';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import userImage from '../user/user.png' // relative path to image
import { Link } from 'react-router-dom';
var fileDownload = require('react-file-download');

class ViewProject extends Component {

    notify = (message) => toast(message);

    constructor(props) {
        super(props);

        this.state = {
            project: {},
            projectId: '',
            bidRate: 0,
            bidLimit: 0,
            submitted: false,
            bidList: [],
            user: UserHelper.getUserObject(),
            uploadedFiles: [],
            fileNames: [],
            creditCardNumber: '',
            expiration: '',
            cardCvv: '',
            payingAmount: '',
            cardSubmitted: false,
            invalidCreditCardNumber: false,
            invalidExpiration: false,
            invalidCardCvv: false,
            invalidAmount: false,
            totalAmount: 0
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCardDetails = this.handleCardDetails.bind(this);
    }

    componentDidMount() {
        var projectId = this.props.match.params.projectId;
        this.setState({
            projectId: this.props.match.params.projectId
        })
        if (!!projectId) {
            API.getProjectById(projectId)
                .then((resultData) => {
                    if (!!resultData.data) {
                        this.setState({
                            project: resultData.data,
                            fileNames: resultData.data.files
                        });
                    } else {
                        console.log("No project of that ID");
                    }
                }).then(() => {
                    API.getAllBidsByProject(projectId)
                        .then((resultData) => {
                            if (!!resultData.data && resultData.data.length > 0) {
                                this.setState({
                                    bidList: resultData.data
                                });
                            } else {
                                console.log("No Bids for that project");
                            }
                        });
                }).then(() => {
                    this.getTotalAmountFromDb(this.state.project._id);
                });
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        this.setState({ submitted: true });
        const { bidRate, bidLimit } = this.state;
        if (bidRate && bidLimit) {
            let bidObj = {};
            bidObj.userId = UserHelper.getUserObject()._id;
            bidObj.projectId = this.state.project._id;
            bidObj.bidRate = bidRate;
            bidObj.bidLimit = bidLimit;
            bidObj.bidType = this.state.project.jobType;
            API.placeBid(bidObj)
                .then((resultData) => {
                    if (resultData.data !== undefined && resultData.data !== null) {
                        this.notify(resultData.meta.message);
                    } else {
                        this.notify(resultData.message);
                    }
                }).catch(error => {
                    this.notify(error);
                });
        }
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
        if (!this.validateAmount()) {
            this.setState({
                invalidAmount: true
            });
        } else {
            this.setState({
                invalidAmount: false
            });
        }
        if (this.validateAmount() && UserHelper.validateCardCvv(this.state.cardCvv) && UserHelper.validateCardNumber(this.state.creditCardNumber) && UserHelper.validateExpiration(this.state.expiration)) {
            let projectObj = {};
            projectObj.projectId = this.state.project._id;
            projectObj.senderId = this.state.user._id;
            projectObj.receiverId = this.state.project.freelancer;
            projectObj.amount = this.state.payingAmount;
            projectObj.type = 'CREDIT';
            API.savePaymentDetails(projectObj)
                .then((resultData) => {
                    if (resultData.data !== undefined && resultData.data !== null) {
                        this.notify(resultData.meta.message);
                    } else {
                        this.notify(resultData.message);
                    }
                    projectObj.senderId = this.state.user._id;
                    projectObj.receiverId = this.state.user._id;
                    projectObj.amount = this.state.payingAmount;
                    projectObj.type = 'DEBIT';
                    API.savePaymentDetails(projectObj)
                        .then((resultData) => {
                            let userObj = this.state.user;
                            userObj.totalMoney = Number(userObj.totalMoney) - Number(this.state.payingAmount);
                            this.setState({
                                user: userObj
                            })
                            UserHelper.setUserObject(userObj);
                        });
                    if ((this.state.project.jobRate - (this.state.totalAmount + Number(this.state.payingAmount))) === 0) {
                        let updateObj = {};
                        updateObj = this.state.project;
                        updateObj.status = "CLOSED";
                        API.hireFreelancer(updateObj)
                            .then((resultData) => {
                                if (resultData.data !== undefined && resultData.data !== null) {
                                    this.setState({
                                        project: updateObj
                                    });
                                    this.notify("Project is closed now!");
                                } else {
                                    this.notify(resultData.message);
                                }
                            }).catch(error => {
                                this.notify(error);
                            });
                    }
                }).catch(error => {
                    this.notify(error);
                });
        }
    }

    getTotalAmountFromDb = function (projectId) {
        API.getTotalAmt({ projectId: projectId })
            .then((resultData) => {
                if (resultData.data !== undefined && resultData.data !== null) {
                    this.setState({
                        totalAmount: resultData.data.totalAmount
                    });
                } else {
                    this.notify(resultData.message);
                }
            }).catch(error => {
                this.notify(error);
            });
    }

    validateAmount() {
        return this.state.payingAmount <= (this.state.project.jobRate - this.state.totalAmount);
    }

    hireFreelancer(userId) {
        let hireObj = {};
        hireObj = this.state.project;
        hireObj._id = this.state.project._id;
        hireObj.projectName = this.state.project.projectName;
        hireObj.status = "ASSIGNED";
        hireObj.freelancer = userId;
        API.hireFreelancer(hireObj)
            .then((resultData) => {
                if (resultData.data !== undefined && resultData.data !== null) {
                    this.setState({
                        project: hireObj
                    });
                    this.notify(resultData.meta.message);
                } else {
                    this.notify(resultData.message);
                }
            }).catch(error => {
                this.notify(error);
            });
    }

    uploadFiles(e) {
        e.preventDefault();
        this.setState({
            uploadedFiles: this.refs['uploadFile'].files
        })
        const data = new FormData();
        data.append('projectId', this.state.project._id);
        data.append('projectFile', this.refs['uploadFile'].files[0]);
        API.uploadProjectFiles(data)
            .then((resultData) => {
                let tempArr = this.state.fileNames;
                tempArr.push(resultData.data);
                this.setState({
                    fileNames: tempArr
                })
                this.notify(resultData.meta.message);
            }).catch(error => {
                this.notify(error);
            });
    }

    downloadProjectFiles = function (projectFileName) {
        API.downloadProjectFiles({ filename: projectFileName })
            .then((resultData) => {
                fileDownload(resultData.data, projectFileName.split('@-@')[1]);
            }).catch(error => {
                this.notify(error);
            });
    }

    render() {
        const fileCols = [{
            Header: 'Submitted Documents',
            accessor: 'name',
            Cell: props => (<div>
                <a onClick={() => {
                    this.downloadProjectFiles(props.row._original)
                }}>
                    <span>{props.row._original.split('@-@')[1]}</span>
                </a>
            </div>)
        }]
        const columns = [{
            Header: 'FREELANCERS BIDDING',
            accessor: 'userName',
            width: 300,
            style: { 'whiteSpace': 'unset' },
            Cell: props => (<div>
                {props.row._original.avatar &&
                    <img alt="" src={props.row._original.avatar} height="50px" width="50px" />}
                {!props.row._original.avatar &&
                    <img alt="" src={userImage} height="50px" width="50px" />}
                <Link to={'/userprofile/' + props.row._original._id}>
                    <button
                        className="btn-link"
                        type="button"
                    >{props.row._original.userName}
                    </button>
                </Link>
            </div>)
        }, {
            Header: 'SKILLS',
            accessor: 'skills',
            width: this.state.user.role === 1 ? 300 : 400,
            style: { 'whiteSpace': 'unset', 'textAlign': 'left' },
        }, {
            Header: 'BID (USD)',
            accessor: 'bidRate',
            style: { 'textAlign': 'right' },
            Cell: props => (<div>
                <span>{'$' + props.row._original.bidRate + '/' + UserHelper.getJobType(props.row._original.bidType)}</span>
            </div>)
        }]
        if (this.state.user.role === 1 && this.state.project.status === 'OPEN') {
            let hireObj = {
                Header: 'HIRE FREELANCER',
                style: { 'textAlign': 'right' },
                Cell: props => (<div>
                    <button onClick={() => {
                        this.hireFreelancer(props.row._original._id)
                    }}
                        className="btn btn-info"
                        type="button"
                    >HIRE
                        </button>
                </div>)
            }
            columns.push(hireObj);
        } else if (this.state.project.status === 'ASSIGNED') {
            let hireObj = {
                Header: 'HIRE FREELANCER',
                style: { 'textAlign': 'right' },
                Cell: props => (<div>
                    <span className="open-status">{this.state.project.freelancer === props.row._original._id ? 'HIRED' : ''}</span>
                </div>)
            }
            columns.push(hireObj);
        }
        return (
            <div className="col-md-12 main-content">
                <ToastContainer />
                <div className="col-md-offset-2 col-md-8">
                    <form name="form" className="login-form" onSubmit={this.handleSubmit}>
                        <div className="well white-color">
                            <table className="table mr-b-0">
                                <thead>
                                    <tr>
                                        <th className="table-header">Bids</th>
                                        <th width="130px" className="table-header">Avg Bid (USD)</th>
                                        <th className="table-header">Project Budget (USD)</th>
                                        <th><span className="green-txt">6 days, 23 hours left</span></th>
                                        <th><i className="bookmark fs-25 fas fa-bookmark"></i></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="bid-info">{!!this.state.project.bidCount
                                            ? this.state.project.bidCount : 0}</td>
                                        <td className="bid-info">{!!this.state.project.avgRate
                                            ? this.state.project.avgRate : 'N/A'}</td>
                                        <td className="bid-info">{'$' + this.state.project.jobRate +
                                            '/' + UserHelper.getJobType(this.state.project.jobType)}</td>
                                        <td className="open-status">{this.state.project.status}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="well white-color collapse" id="collapseExample">
                            <div className="card card-body">
                                <fieldset>
                                    <div className="col-md-12">
                                        <div className="col-md-4">
                                            <label className="control-label">{this.state.project.jobType === 'HOURLY' ? 'Hourly Rate' : 'Paid to you: '}</label>
                                            <div className={(this.state.submitted && !this.state.bidRate ? ' has-error' : '')}>
                                                <div className="input-group">
                                                    <span className="input-group-addon">$</span>
                                                    <input type="text" className="form-control"
                                                        value={this.state.bidRate}
                                                        onChange={(event) => {
                                                            this.setState({ bidRate: event.target.value })
                                                        }} />
                                                    {this.state.project.jobType === 'HOURLY' && <span className="input-group-addon">USD/Hr</span>}
                                                </div>
                                                {this.state.submitted && !this.state.bidRate &&
                                                    <div className="help-block">Bid Rate is required</div>
                                                }
                                            </div>
                                        </div>
                                        <div className="col-md-offset-2 col-md-3 pd-left-0">
                                            <label className="control-label">{this.state.project.jobType === 'HOURLY' ? 'Weekly Limit' : 'Deliver in: '}</label>
                                            <div className={(this.state.submitted && !this.state.bidLimit ? ' has-error' : '')}>
                                                <div className="input-group">
                                                    <input type="text" className="form-control"
                                                        value={this.state.bidLimit}
                                                        onChange={(event) => {
                                                            this.setState({ bidLimit: event.target.value })
                                                        }} />
                                                    <span className="input-group-addon">{this.state.project.jobType === 'HOURLY' ? 'Hours' : 'Days'}</span>
                                                </div>
                                                {this.state.submitted && !this.state.bidLimit &&
                                                    <div className="help-block">Limit is required</div>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <br />
                                    <div className="col-md-12 mr-t-25">
                                        <div className="col-md-6 pd-right-0">
                                            <div className="form-group clearfix">
                                                <span className="col-md-5 pd-left-0 fs-13">Project Fee</span>
                                                <span className="col-md-6 fs-12"><b>{this.state.project.jobType === 'HOURLY' ? '$2.22 USD / Hr' : (Number(this.state.project.jobRate) / 20)}</b></span>
                                            </div>
                                            <div className="form-group clearfix">
                                                <span className="col-md-5 pd-left-0 fs-13">Your Total Bid Fee</span>
                                                <span className="col-md-6 fs-12"><b>{this.state.project.jobType === 'HOURLY' ? '$' + (Number(this.state.bidRate) + 2.22) + 'USD / Hr' : '$' + (Number(this.state.bidRate) + (Number(this.state.project.jobRate) / 20))}</b></span>
                                            </div>
                                            {this.state.project.jobType === 'HOURLY' &&
                                                <div className="form-group clearfix">
                                                    <span className="col-md-5 pd-left-0 fs-13">Weekly Milestone</span>
                                                    <span className="col-md-6 fs-12"><b>${Number(this.state.bidLimit) * (Number(this.state.bidRate) + 2.22)} USD</b></span>
                                                </div>
                                            }
                                        </div>
                                        {this.state.project.jobType === 'HOURLY' &&
                                            <div className="col-md-6 pd-left-0">
                                                <div className="form-group">
                                                    <span><b>Note: </b>For hourly projects, the fee is charged on each payment when it is paid to you.</span>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                    <hr />
                                    <div className="form-group clearfix">
                                        <a className="pull-right cancel-link">Cancel</a>
                                        <button
                                            className="btn btn-info btn-md bid-project-btn pull-right"
                                            type="submit"
                                        >Place Bid
                                                </button>
                                    </div>
                                </fieldset>
                            </div>
                        </div>
                        <div className="well white-color">
                            <h4><b>{this.state.project.project_name}</b>
                                {this.state.user.role === 2 && (this.state.project.status !== 'CLOSED'
                                    || this.state.project.status !== 'ASSIGNED') &&
                                    <button className="btn btn-info btn-md bid-project-btn pull-right"
                                        type="button" data-toggle="collapse" data-target="#collapseExample"
                                        aria-expanded="false" aria-controls="collapseExample">
                                        Bid on This Project
                            </button>
                                }
                            </h4>
                            <h4 className="mr-t-0"><b>Project Description</b></h4>
                            {this.state.project.description}
                            <br />
                            <h5><b>Hours Of Work</b></h5>
                            {'$' + this.state.project.jobRate + "/" + UserHelper.getJobType(this.state.project.jobType)}
                        </div>
                        <div className="well white-color">
                            <h4 className="mr-t-0"><b>Skills Required</b></h4>
                            {this.state.project.skills}
                        </div>
                        <div className="well white-color">
                            < ReactTable
                                minRows={0}
                                showPagination={false}
                                data={this.state.bidList}
                                columns={columns} />
                        </div>
                    </form>
                    {this.state.project.status === 'ASSIGNED' &&
                        <div>
                            <div className="well white-color">
                                <h4 className="mr-t-0"><b>Submission Panel</b></h4>
                                <form ref='uploadForm'
                                    id='uploadForm'
                                    encType="multipart/form-data">
                                    <fieldset>
                                        <div className="row">
                                            <div className="col-md-7">
                                                <form className="form-inline">
                                                    <input type="file" multiple
                                                        className="form-control" name="sampleFile"
                                                        ref='uploadFile' />&nbsp;&nbsp;&nbsp;
                                                <button type='button'
                                                        className="btn btn-default post-project mrt0 mr-left-10"
                                                        onClick={(e) => this.uploadFiles(e)}>Submit</button>
                                                </form>
                                            </div>
                                            <br /><br />
                                            <div id="files" className="col-md-12 files">
                                                {!!this.state.fileNames && this.state.fileNames.length > 0 &&
                                                    < ReactTable
                                                        minRows={0}
                                                        showPagination={false}
                                                        data={this.state.fileNames}
                                                        columns={fileCols} />
                                                }

                                            </div>
                                        </div>
                                    </fieldset>
                                </form>
                            </div>
                            <div className="well white-color " >
                                {this.state.user.role === 1 &&
                                    <button className="btn btn-info btn-md bid-project-btn"
                                        type="button" data-toggle="collapse" data-target="#paymentBox"
                                        aria-expanded="false" aria-controls="paymentBox">
                                        Make Payment
                                            </button>
                                }
                                <div className="mr-t-10 card card-body collapse clearfix" id="paymentBox">

                                    <div className="panel panel-default credit-card-box">
                                        <div className="panel-heading display-table" >
                                            <div className="row display-tr" >
                                                <h3 className="panel-title display-td" >Payment Details</h3>
                                                <div className="display-td" >
                                                    <img alt="Card Not Availbale" className="img-responsive pull-right"
                                                        src="http://i76.imgup.net/accepted_c22e0.png" />
                                                </div>
                                            </div>
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
                                                            <label htmlFor="cardNumber">Paying Amount</label>
                                                            <div className={(this.state.cardSubmitted && (!this.state.payingAmount || this.state.invalidAmount) ? ' has-error' : '')}>
                                                                <div className="input-group">
                                                                    <input
                                                                        type="number"
                                                                        className="form-control"
                                                                        name="payingAmt"
                                                                        placeholder="Deposit Amount"
                                                                        required autoFocus
                                                                        value={this.state.payingAmount}
                                                                        onChange={(event) => {
                                                                            this.setState({ payingAmount: event.target.value })
                                                                        }}
                                                                    />
                                                                </div>
                                                                {this.state.cardSubmitted && (!this.state.payingAmount || this.state.invalidAmount) &&
                                                                    <div className="help-block">Amount is invalid</div>
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-xs-12">
                                                        <button className="subscribe btn btn-success btn-lg btn-block"
                                                            type="button" onClick={(e) => this.handleCardDetails(e)}>Pay Now</button>
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
                            </div>
                        </div>
                    }
                </div>
            </div>
        )
    }
}

export default ViewProject;