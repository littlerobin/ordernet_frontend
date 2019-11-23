import React from 'react';
import { Redirect } from 'react-router-dom';

import ls from 'local-storage';

class SplashPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            redirect: false
        }
    }

    componentDidMount() {
        this.id = setTimeout(() => {
            this.setState({redirect: true})
        }, 1500)
    }

    render() {
        const { redirect } = this.state;

        return redirect === false ? (<div>
            <img src="../assets/logo.png" style={{marginLeft: '15%', marginTop: '5%', width: '70%'}}/>
        </div>) : (ls.get('passed_company') === true ? <Redirect to="/logincustomer"/> : <Redirect to="/logincompany"/>)
    }
}

export default SplashPage;