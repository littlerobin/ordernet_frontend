import React from 'react';

import axios from 'axios';
import Header from '../Layout/Header';

import APIInfo from '../Constants/API';

import './Page.css';

class AccountPage extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            isLoading: false,
            customer:{}
        };
    }

    async componentWillMount() {
        this.setState({isLoading: true});

        axios({
            method: 'post',
            url: `${APIInfo.serverUrl}${APIInfo.apiContext}${APIInfo.version}${APIInfo.customer}`,
            data: {
                username: 'americ',
                password: 'americ'
            }
        })
        .then((response) => {
            let data = response.data;
            this.setState({customer: data.userinfo, isLoading: false});
        })
        .catch((err) => {
            console.log(err);
            this.setState({isLoading: false});
        });
    }

    render() {
        let { isLoading, customer } = this.state;
        return customer === undefined ? (<div>loading...</div>) : (
            <div>
                <Header currentPage={1}/>
                <div className="page text-center">
                    {
                        isLoading === true ? (<div class="text-center" style={{marginTop: '10%'}}>Loading Data. Please wait...</div>) :
                        (
                            <div>
                                <div className="customer-id">
                                    Customer ID: {customer.custno}
                                </div>
                                <div className="company-name">
                                    {customer.company}
                                </div>
                                <div className="text-default">
                                    {customer.billingaddress1}
                                </div>
                                <div className="text-default">
                                    {customer.city}, {customer.state}, {customer.zip}
                                </div>
                                <div className="text-default">
                                    {customer.billingphone}
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        )
    }
}

export default AccountPage;