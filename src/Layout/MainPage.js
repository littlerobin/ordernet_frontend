import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import '../App.css';

import { AccountPage, ContactUsPage, OrderingPage, ReportsPage } from '../Components';
import { Header } from './';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Switch>
        <Header/>
        <div className="page">
          <Switch>
            <Route path = "/mainpage/ordering" component = {OrderingPage}/>
            <Route path = "/mainpage/account" component = {AccountPage}/>
            <Route path = "/mainpage/reports" component = {ReportsPage}/>
            <Route path = "/mainpage/contactus" component = {ContactUsPage}/>
          </Switch>
        </div>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
