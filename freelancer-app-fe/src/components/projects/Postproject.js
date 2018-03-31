import React, { Component } from 'react';
import './project.css';
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import * as UserHelper from '../_helper/helper';
import * as API from '../../api/API';
import { ToastContainer, toast } from 'react-toastify';
const _ = require('lodash');

class PostProject extends Component {

    notify = (message) => toast(message);

    constructor(props) {
        super(props);

        this.state = {
            projectName: '',
            description: '',
            jobType: 'HOURLY',
            jobRate: '',
            skills: '',
            submitted: false,
            skillList:[]
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        API.getSkills()
            .then((resultData) => {
                if (!!resultData.data && resultData.data.length > 0) {
                    this.setState({
                        skillList: _.map(resultData.data, 'skillName')
                    });
                } else {
                    console.log("No skills available from DB");
                }
            });
    }

    handleSubmit(e) {
        e.preventDefault();
        this.setState({ submitted: true });
        const { projectName, description, skills, jobRate } = this.state;
       
        if (projectName && description && skills && jobRate) {
            let projectObject = this.state;
            projectObject.employer = UserHelper.getUserObject()._id;
            projectObject.skills = projectObject.skills.toString();
            delete projectObject.submitted;
            delete projectObject.skillList;
            API.postProject(projectObject)
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

    render() {
        return (
            <div className="col-md-12 main-content">
                <ToastContainer />
                <div className="col-md-offset-3 col-md-6">
                    <form name="form" className="login-form" onSubmit={this.handleSubmit}>
                        <section>
                            <img className="project-img" src={require('../../../src/Freelancer_logo.png')} alt="Not Available" />
                        </section>
                        <section id="project-info">
                            <h1>Tell us what you need done</h1>
                            <p>
                                Get free quotes from skilled freelancers within minutes,
                                 view profiles, ratings and portfolios and chat with them.
                                 Pay the freelancer only when you are 100% satisfied with their work.
                    </p>
                        </section>
                        <br />
                        <section>
                            <h4><b>Choose a name for your project</b></h4>

                            <div className={(this.state.submitted && !this.state.projectName ? ' has-error' : '')}>
                                <input type="text"
                                    placeholder="e.g. Build me a website"
                                    className="form-control project-input"
                                    id="projectName"
                                    name="projectName"
                                    value={this.state.projectName}
                                    onChange={(event) => {
                                        this.setState({ projectName: event.target.value })
                                    }} />
                                {this.state.submitted && !this.state.projectName &&
                                    <div className="help-block">Project Name is required</div>
                                }
                            </div>

                        </section>
                        <br />
                        <section>
                            <h4><b>Tell us more about your project</b></h4>
                            <p>
                                Great project descriptions include a little bit about yourself,
                                 details of what you are trying to achieve, and any decisions that you have already made about your project.
                                If there are things you are unsure of, don't worry, a freelancer will be able to help you fill in the blanks.
                        </p>
                        </section>
                        <br />
                        <section>
                            <h4><b>Describe your project</b></h4>

                            <div className={(this.state.submitted && !this.state.description ? ' has-error' : '')}>
                                <textarea type="text"
                                    placeholder="Describe your project here"
                                    className="form-control project-textarea"
                                    id="projectDesc"
                                    name="projectDesc"
                                    rows="5"
                                    value={this.state.description}
                                    onChange={(event) => {
                                        this.setState({ description: event.target.value })
                                    }}></textarea>
                                {this.state.submitted && !this.state.description &&
                                    <div className="help-block">Project Description is required</div>
                                }
                            </div>
                        </section>
                        <br />
                        <section>
                            <h4><b>What skills are required?</b></h4>
                            <p>
                                Enter up to 5 skills that best describe your project.
                                Freelancers will use these skills to find projects they are most interested and experienced in.
                        </p>
                            <div className={(this.state.submitted && !this.state.skills ? ' has-error' : '')}>
                               <Typeahead
                                    multiple
                                    onChange={(selected) => {
                                        this.setState({
                                            skills: selected
                                        })
                                    }}
                                    options={this.state.skillList}
                                /><br />
                                <p>Suggested skills:  Website Design , Logo Design , Mobile App Development , Data Entry , Article Writing</p>
                                {this.state.submitted && !this.state.skills &&
                                    <div className="help-block">Skills is required</div>
                                }
                            </div>
                        </section>
                        <br />
                        <section>
                            <h4><b>How do you want to pay?</b></h4>
                            <div className="radio">
                                <input id="radio-1"
                                    name="radio"
                                    type="radio"
                                    value="HOURLY"
                                    checked={this.state.jobType === 'HOURLY'}
                                    onChange={(event) => {
                                        this.setState({
                                            jobType: event.target.value
                                        })
                                    }} />
                                <label htmlFor="radio-1" className="radio-label">Hourly Project</label>
                            </div>
                            <div className="radio">
                                <input id="radio-2"
                                    name="radio"
                                    type="radio"
                                    value="FIXED"
                                    checked={this.state.jobType === 'FIXED'}
                                    onChange={(event) => {
                                        this.setState({
                                            jobType: event.target.value
                                        })
                                    }} />
                                <label htmlFor="radio-2" className="radio-label">Fixed Price Project</label>
                            </div>
                        </section>
                        <br />
                        <section className="clearfix">
                            <h4><b>What is your estimated budget?</b></h4>
                            <div className="col-md-12 pd-left-0">
                                <div className="col-md-2 pd-left-0">
                                    <select className="form-control project-input"
                                        id="jobCurrency"
                                        name="jobCurrency">
                                        <option value="USD">USD</option>
                                    </select>
                                </div>
                                <div className="col-md-4 pd-left-0">
                                    <div className={(this.state.submitted && !this.state.jobRate ? ' has-error' : '')}>
                                        <input type="text"
                                            placeholder="Describe Your budget"
                                            className="form-control project-input"
                                            id="jobRate"
                                            name="jobRate"
                                            value={this.state.jobRate}
                                            onChange={(event) => {
                                                this.setState({
                                                    jobRate: event.target.value
                                                })
                                            }} />
                                        {this.state.submitted && !this.state.jobRate &&
                                            <div className="help-block">Budget is required</div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </section>
                        <br />
                        <section>
                            <button className="btn btn-primary btn-small post-project">Post a Project</button>
                        </section>
                        <br /><br />
                    </form>
                </div>
            </div>
        )
    }
}

export default PostProject;