import React, { Component } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import * as API from '../../api/API';
import { Link } from 'react-router-dom';
import * as UserHelper from '../_helper/helper';
const Timestamp = require('react-timestamp');


class SearchProjects extends Component {

    constructor(props) {
        super(props);

        this.state = {
            projectList: [],
            user: UserHelper.getUserObject()
        };
    }

    componentWillReceiveProps() {
        this.getProjects();
    }

    componentDidMount() {
        this.getProjects();
    }

    getProjects = function() {
        API.getSearchedProjects(this.props.match.params.searchStrng)
            .then((resultData) => {
                if (!!resultData.data) {
                    this.setState({
                        projectList: resultData.data
                    });
                } else {
                    console.log("There are no open projects in DB");
                }
            });
    }

    render() {
        const columns = [{
            Header: 'PROJECTS',
            accessor: 'projectName',
            width: 500,
            style: { 'whiteSpace': 'unset' },
            filterMethod: (filter, row) => {
                return row[filter.id].toLowerCase().includes(filter.value.toLowerCase())
            },
            Cell: props => (<div><i className="fas fa-tv project-name"></i><Link to={'/viewproject/' + props.row._original._id}>
                <button
                    className="btn-link project-name"
                    type="button"
                ><b>{props.row._original.projectName}</b>
                </button>
            </Link>
                <br />
                <br />
                <span>{props.row._original.description}</span>
                <br />
                <br />
                <a>Skills: {props.row._original.skills}</a>
            </div>)
        }, {
            Header: 'BIDS/ENTRIES',
            accessor: 'bidCount',
            style: { 'textAlign': 'right' },
            Cell: props => (<span>{!!props.row._original.bidCount ? props.row._original.bidCount : 0}</span>)
        }, {
            Header: 'STARTED',
            accessor: 'createdAt',
            style: { 'textAlign': 'right' },
            Cell: props => <span className='number'><Timestamp time={props.value} format='date' /></span>
        }, {
            Header: 'PRICE (USD)',
            accessor: 'jobRate',
            style: { 'textAlign': 'right' },
            Cell: props => (<span>{props.row._original.jobRate + '/' + UserHelper.getJobType(props.row._original.jobType)}</span>)
        }, {
            Header: 'SKILLS',
            accessor: 'skills',
            width: 300,
            style: { 'textAlign': 'right', 'whiteSpace': 'unset' },
            filterMethod: (filter, row) => {
                return row[filter.id].toLowerCase().includes(filter.value.toLowerCase())
            },
            Cell: props => (<span>{props.row._original.skills}</span>)
        }, {
            Header: 'STATUS',
            accessor: 'status',
            style: { 'textAlign': 'right' },
            filterMethod: (filter, row) => {
                return row[filter.id].toLowerCase().includes(filter.value.toLowerCase())
            },
            Cell: props => (<span className="open-status">{props.row._original.status}</span>)
        }]
        return (
            <div className="main-body">
                {this.state.status == 'skills' &&
                    <div className="col-md-offset-1 col-md-10 mr-t-50 skill-frame">
                        <div className="well white-color">
                            <h4>Your Skills : {this.state.user.skills}</h4>
                        </div>
                    </div>
                }
                <div className="col-md-offset-1 col-md-10 mr-t-10">
                    < ReactTable
                        minRows={0}
                        filterable={true}
                        data={this.state.projectList}
                        columns={columns} />
                </div>
            </div>
        )
    }

}

export default SearchProjects;