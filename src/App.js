import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import './App.css';
import APIInfo from './Constants/API';

import { AccountPage, ContactUsPage, OrderingPage, ReportsPage } from './Components';
import { LoginCompanyPage, LoginCustomerPage, SplashPage } from './Layout';
import { ColorProvider } from './Components/ColorProvider';

function App() {

  return (
    <ColorProvider>
      <div className="app">
        <BrowserRouter basename={APIInfo.baseUrl}>
          <Switch>
            <Route exact path="/" component={SplashPage}/>
            <Route exact path="/logincompany" component={LoginCompanyPage}/>
            <Route exact path="/logincustomer" component={LoginCustomerPage}/>
            <Route path = "/ordering" component = {OrderingPage}/>
            <Route path = "/account" component = {AccountPage}/>
            <Route path = "/reports" component = {ReportsPage}/>
            <Route path = "/contactus" component = {ContactUsPage}/>
          </Switch>
        </BrowserRouter>
      </div>
    </ColorProvider>
  )
}

export default App;
