import React from 'react';
import { Redirect, Link } from 'react-router-dom';

import './Header.css';

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            appTitle: "OrderNet",
            version: "1.31",
            currentPage: props.currentPage,
            isLogout: false,
        }

        this.logOut = this.logOut.bind(this);
    }

    logOut() {
        this.setState({isLogout: true});
    }

    render() {
        let { isLogout, currentPage, appTitle, version } = this.state;

        if (isLogout === true) {
            return <Redirect to="/" />
        }

        return (<div className="tab-header">
            <Link to="/ordering">
                <span className={currentPage === 0 ? 'tab-header-button active' : 'tab-header-button'} onClick={() => {this.setState({currentPage: 0})}}>    
                    Ordering
                </span>
            </Link>
            <Link to="/account">
                <span className={currentPage === 1 ? 'tab-header-button active' : 'tab-header-button'} onClick={() => {this.setState({currentPage: 1})}}>
                    Account
                </span>
            </Link>
            <Link to="/reports">
                <span className={currentPage === 2 ? 'tab-header-button active' : 'tab-header-button'} onClick={() => {this.setState({currentPage: 2})}}>
                    Reports
                </span>
            </Link>
            <Link to="/contactus">
                <span className={currentPage === 3 ? 'tab-header-button active' : 'tab-header-button'} onClick={() => {this.setState({currentPage: 3})}}>
                    Contact Us
                </span>
            </Link>
            <Link onClick={this.logOut}>
                <span className="tab-header-button">
                    Log Out
                </span>
            </Link>
            <div className="float-right">
                <span className="header-app-title">{appTitle}</span>
                <span className="header-app-version">{`v${version}`}</span>
            </div>
        </div>);
    }
}

export default Header;