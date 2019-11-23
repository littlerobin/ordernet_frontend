import React from 'react';
import { Redirect } from 'react-router-dom';

import '../App.css';
import ls from 'local-storage';

class LoginCompanyPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            company: '',
            passed: false,
            failed: false,
        }
    }

    onInputChange = e => {
        this.setState({company: e.target.value, failed: false});
    }

    onConfirm() {
        if (this.state.company === "luckyproduce") {
            ls.set("passed_company", true);
            this.setState({passed: true});
        }
        else {
            this.setState({failed: true});
        }
    }

    render() {
        const key = ls.get("passed_company");
        const { passed, failed } = this.state;
        
        if (key === true || passed === true) 
            return <Redirect to="/logincusomterpage"/>

        return (<div style={{textAlign: 'center', marginTop: '30%', height: '40%'}}>
            <div style={{color: 'blue', fontSize: '1.5rem', fontWeight: 700}}>OrderNet</div>
            <div style={{marginBottom: 5}}>Please enter the company name below</div>
            <input style={{marginBottom: 5, width: "25em"}} type="text" placeholder="Enter Company Name Here" onChange={e => this.onInputChange(e)}/>
            <br/>
            {
                failed === false ? (<div></div>) : (<div style={{color: 'red'}}>
                    Unable to retrieve data from server.<br/>Please make sure that you have entered a correct company name.
                </div>)
            }
            <div class="show-statement" style={{marginBottom: 5, height: '3em', lineHeight: '3em', verticalAlign: 'middle',
                width: '5em', backgroundColor: '#F4F1F4', margin: 'auto'}} onClick={() => {this.onConfirm()}}>SAVE</div>
            <br/>
            <label>
                <input type="checkbox"/> MODE 2 
            </label>
        </div>)
    }
}

export default LoginCompanyPage;