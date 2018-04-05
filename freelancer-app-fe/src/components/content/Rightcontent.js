import React, { Component } from 'react';
import './maincontent.css';
import * as API from '../../api/API';
import * as UserHelper from '../_helper/helper';
import { Pie } from 'react-chartjs-2';

class RightContent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            user: UserHelper.getUserObject(),
            chartData: {},
            chartOptions: {}
        }
    }

    componentDidMount() {
        API.getTransactionCount({ userId: this.state.user._id })
            .then((resultData) => {
                if (!!resultData.data && resultData.data.length > 0) {
                    let creditCount = 0;
                    let debitCount = 0;
                    for (let i = 0; i < resultData.data.length; i++) {
                        if (resultData.data[i].type === 'CREDIT') {
                            creditCount = creditCount + resultData.data[i].amount;
                        } else if (resultData.data[i].type === 'DEBIT') {
                            debitCount = debitCount + resultData.data[i].amount;
                        }
                    }
                    let chartData = {
                        labels: ["Incoming", "Outgoing"],
                        datasets: [{
                            label: 'Transaction Flow',
                            data: [creditCount, debitCount],
                            backgroundColor: [
                                'rgb(255, 90, 94)',
                                'rgb(90, 211, 209)'
                            ],
                            borderColor: [
                                'rgba(255,99,132,1)',
                                'rgba(54, 162, 235, 1)',
                            ],
                            borderWidth: 1
                        }]
                    }
                    let chartOptions = {
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero: true
                                }
                            }]
                        }
                    }
                    this.setState({
                        chartData: chartData,
                        chartOptions: chartOptions
                    })
                } else {
                    console.log("No History available from DB");
                }
            });
    }


    render() {
        return (
            <div>
                <div className="col-md-4">
                    <div className="panel panel-success user_panel">
                        <div className="panel-heading">
                            <h3 className="panel-title">Projects Near Me</h3>
                        </div>
                        <div className="panel-body">
                            <ul className="list-group">
                                <li className="list-group-item">
                                    <a><i className="fas fa-utensils"></i> Restaurant Consultant</a>
                                    <button className="btn btn-sm btn-success pull-right">View </button>
                                    <p className="card-text mr-t-5px">
                                        <i className="fas fa-map-marker"></i> San Jose, United States (0 km away)</p>
                                </li>
                                <li className="list-group-item">
                                    <div className="card-title">
                                        <a><i className="fas fa-utensils"></i> Make a Video</a>
                                        <button className="btn btn-sm btn-success pull-right">View </button>
                                    </div>
                                    <p className="card-text mr-t-5px">
                                        <i className="fas fa-map-marker"></i> Ben Lomond, United States (32.9 km away)</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <Pie data={this.state.chartData} options={this.state.chartOptions} />
                </div>
            </div>
        );
    }
}

export default RightContent;
