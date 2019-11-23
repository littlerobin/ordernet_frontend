import React from 'react';
import { HashRouter, Switch, Route, Redirect } from 'react-router-dom';

import './App.css';
import ls from 'local-storage';

import { AccountPage, ContactUsPage, OrderingPage, ReportsPage } from './Components';
import { Header, LoginCompanyPage, LoginCustomerPage, SplashPage } from './Layout';

function App() {
  return (
    <div className="app">
      <HashRouter>
        <Switch>
          <Route exact path="/" component={SplashPage}/>
          <Route exact path="/logincompany" component={LoginCompanyPage}/>
          <Route exact path="/logincustomer" component={LoginCustomerPage}/>
          <Route path = "/ordering" component = {OrderingPage}/>
          <Route path = "/account" component = {AccountPage}/>
          <Route path = "/reports" component = {ReportsPage}/>
          <Route path = "/contactus" component = {ContactUsPage}/>
        </Switch>
      </HashRouter>
    </div>)
}

export default App;
