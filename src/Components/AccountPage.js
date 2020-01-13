import React from 'react';

import axios from 'axios';
import Header from '../Layout/Header';

import APIInfo from '../Constants/API';

import './Page.css';
import cookie from 'js-cookie';

class AccountPage extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            isLoading: false,
            customer: JSON.parse(cookie.get('ordernet_customer')),
        };
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