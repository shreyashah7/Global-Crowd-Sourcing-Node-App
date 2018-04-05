import React, { Component } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import * as API from '../../api/API';
import * as UserHelper from '../_helper/helper';
const Timestamp = require('react-timestamp');


class TransactionHistory extends Component {

    constructor(props) {
        super(props);

        this.state = {
            transactionList: [],
            user: UserHelper.getUserObject()
        }
    }

    componentDidMount() {
        API.getTransactionHistory({ userId: this.state.user._id })
            .then((resultData) => {
                if (!!resultData.data && resultData.data.length > 0) {
                    this.setState({
                        transactionList: resultData.data
                    });
                } else {
                    console.log("No History available from DB");
                }
            });
    }

    render() {
        const columns = [{
            Header: 'TRANSACTION DATE',
            accessor: 'createdAt',
            Cell: props => <span className='number'><Timestamp time={props.value} format='date' /></span>
        }, {
            Header: 'PAYMENT DETAILS',
            accessor: 'projectName',
            style: { 'textAlign': 'right', 'whiteSpace': 'unset' },
            Cell: props => (<span>{!!props.row._original.projectName ? props.row._original.projectName : 'Self Payment'}</span>)
        }, {
            Header: 'PAYMENT TYPE',
            accessor: 'type',
            style: { 'textAlign': 'right' },
            Cell: props => (<span>{!!props.row._original.type
                && props.row._original.type === 'CREDIT' && props.row._original.senderId !== props.row._original.receiverId ? 'TRANSFER' : props.row._original.type}</span>)
        }, {
            Header: 'SENDER Name',
            accessor: 'senderName',
            style: { 'textAlign': 'right' }
        }, {
            Header: 'RECEIVER NAME',
            accessor: 'receiverName',
            style: { 'textAlign': 'right' }
        }, {
            Header: 'AMOUNT (USD)',
            accessor: 'amount',
            style: { 'textAlign': 'right' },
            Cell: props => (<span>{'$' + props.row._original.amount}</span>)
        }]
        return (
            <div className="main-body">
                <div className="col-md-offset-1 col-md-10 mr-t-50 skill-frame">
                    <h2 className="text-center"><b>Transaction History</b></h2>
                </div>
                <div className="col-md-offset-1 col-md-10 mr-t-10">
                    < ReactTable
                        style={{
                            height: "700px"
                        }}
                        minRows={0}
                        filterable={true}
                        data={this.state.transactionList}
                        columns={columns} />
                </div>
            </div>
        )
    }
}

export default TransactionHistory;