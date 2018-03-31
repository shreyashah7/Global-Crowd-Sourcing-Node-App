import React, { Component } from 'react';
import './project.css';
import * as API from '../../api/API';
import * as UserHelper from '../_helper/helper';
import { ToastContainer, toast } from 'react-toastify';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import userImage from '../user/user.png' // relative path to image
import { Link } from 'react-router-dom';

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
            user: UserHelper.getUserObject()
        };

        this.handleSubmit = this.handleSubmit.bind(this);
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
                            project: resultData.data
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

    hireFreelancer(userId) {
        let hireObj = {};
        hireObj._id = this.state.project._id;
        hireObj.status = "CLOSED";
        hireObj.freelancer = userId;
        API.hireFreelancer(hireObj)
            .then((resultData) => {
                if (resultData.data !== undefined && resultData.data !== null) {
                    this.state.project.status = resultData.data.status;
                    this.state.project.freelancer = resultData.data.freelancer;
                    this.notify(resultData.meta.message);
                } else {
                    this.notify(resultData.message);
                }
            }).catch(error => {
                this.notify(error);
            });
    }

    render() {
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
        if (this.state.user.role == 1 && this.state.project.status == 'OPEN') {
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
        } else if (this.state.project.status === 'CLOSED') {
            console.log("inside if",this.state.project.freelancer)
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
                                {this.state.user.role === 2 && this.state.project.status !== 'CLOSED' &&
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
                </div>
            </div>
        )
    }
}

export default ViewProject;