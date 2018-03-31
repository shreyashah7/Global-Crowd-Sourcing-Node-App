import React, { Component } from 'react';
import './maincontent.css';
import * as UserHelper from '../_helper/helper';
import * as API from '../../api/API';
import { Link } from 'react-router-dom';
const Timestamp = require('react-timestamp');

class MainContent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            projectList: [],
            user: {}
        };
    }

    componentDidMount() {
        var userObj = UserHelper.getUserObject();
        this.setState({
            user: userObj
        })
        if (!!userObj) {
            let userInfo = { _id: userObj._id, role: userObj.role };
            API.getLoggedInUserProjects(userInfo)
                .then((resultData) => {
                    if (resultData.data !== undefined && resultData.data !== null) {
                        this.setState({
                            projectList: resultData.data
                        });
                    } else {
                        console.log("No User Projects available in DB");
                    }
                });
        }
    }

    render() {
        // Map through projects and return linked projects
        const projectNode = this.state.projectList.map((project, index) => {
            return (
                <tr key={index + 1}>
                    <td className="text-left">
                        <Link to={'/viewproject/' + project._id}>
                            <button
                                className="btn-link"
                                type="button"
                            >{project.projectName}
                            </button>
                        </Link>
                    </td>
                    {this.state.user.role === 1 &&
                        <td className="text-left">{'$' + project.jobRate + '/' + UserHelper.getJobType(project.jobType)}</td>
                    }
                    {this.state.user.role === 2 &&
                        <td className="text-left">{'$' + project.bidRate + '/' + UserHelper.getJobType(project.bidType)}</td>
                    }
                    <td >
                        <Timestamp time={project.createdAt} format='date' /><br />
                        <small className="text-muted"><Timestamp time={project.createdAt} precision={1} /></small>
                    </td>
                </tr>
            )
        });
        return (
            <div>
                <div className="col-md-offset-1 col-md-6">
                    <div className="panel panel-success user_panel">
                        <div className="panel-heading">
                            <h3 className="panel-title">{this.state.user.role === 1 ? 'My Posted Projects' : 'My Bided Projects'}</h3>
                        </div>
                        <div className="panel-body">
                            <div className="table-container">
                                <table className="table-users table">
                                    <thead>
                                        <tr>
                                            <th>Project Name</th>
                                            <th>{this.state.user.role === 1 && 'Estimated Budget ($)'}{this.state.user.role === 2 && 'Bid Rate ($)'}</th>
                                            <th>Created</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.projectList.length > 0 && projectNode}
                                        {this.state.projectList.length <= 0 &&
                                            <tr>
                                                <td colSpan="3" className="text-center"><b>No projects Available</b></td>
                                            </tr>
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default MainContent;
