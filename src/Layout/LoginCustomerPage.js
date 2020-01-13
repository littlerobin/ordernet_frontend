import React from 'react';
import { Redirect } from 'react-router-dom';

import APIInfo from '../Constants/API';

import axios from 'axios';
import cookie from 'js-cookie';

class LoginCustomerPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            username: '',
            password: '',
            customerNumber: '',
            failed: false,
            passed: false,
        };
    }

    onUserNameChange = e => {
        this.setState({username: e.target.value, failed: false});
    }

    onPasswordChange = e => {
        this.setState({password: e.target.value, failed: false});
    }

    async onConfirm(){
        const { username, password } = this.state;
        this.setState({isLoading: true});

        await axios({
            method: 'post',
            url: `${APIInfo.serverUrl}${APIInfo.apiContext}${APIInfo.version}${APIInfo.userInfo}`,
            data: {
                username: username,
                password: password,
            }
        })
        .then((res) => {
            if (res.data.success === "1")
                this.setState({passed: true, username: username, password: password, customerNumber: res.data.userinfo.custno});
            else
                this.setState({failed: true, isLoading: false});
        })
        .catch((err) => {
            console.log(err);
        })
    }

    render() {
        const { isLoading, failed, passed } = this.state;

        if (passed === true) {
            const { username, password, customerNumber, customer } = this.state;
            cookie.set('ordernet_username', username);
            cookie.set('ordernet_password', password);
            cookie.set('ordernet_customerNumber', customerNumber);
            return <Redirect to="/ordering"/>;
        }


        return (<div style={{textAlign: 'center', marginTop: '30%', height: '40%', maxWidth: '300px', marginLeft: 'auto', marginRight: 'auto'}}>
            <div style={{color: 'blue', fontSize: '1.5rem', fontWeight: 700}}>OrderNet</div>
            <input style={{marginBottom: 5, width: "100%"}} type="text" placeholder="Username" onChange={e => this.onUserNameChange(e)}/>
            <br/>
            <input style={{marginBottom: 5, width: "100%"}} type="text" placeholder="Password" onChange={e => this.onPasswordChange(e)}/>
            <br/>
            {
                failed === false ? (<div></div>) : (<div style={{color: 'red'}}>
                    Incorrect Username or Password<br/>Please try again.
                </div>)
            }
            {
                isLoading === true ? (<div>Please wait...</div>) : (<div></div>)
            }
            <div className="show-statement" style={{marginBottom: 5, height: '3em', lineHeight: '3em', verticalAlign: 'middle',
                width: '5em', backgroundColor: '#F4F1F4', margin: 'auto'}} onClick={() => {this.onConfirm()}}>Login</div>
            <br/>
            <label>
                OrderNet v1.31, Copyright 2019 OrderNet
            </label>
        </div>)
    }
}

export default LoginCustomerPage;