import React from 'react';

import axios from 'axios';
import DatePicker from 'react-datepicker';
import Dropdown from 'react-dropdown';

import APIInfo from '../Constants/API';

import Header from '../Layout/Header';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-dropdown/style.css';

import cookie from 'js-cookie';

class ReportsPage extends React.Component {
    fromDateRef = null;
    toDateRef = null;
    fromSummaryRef = null;
    toSummaryRef = null;

    constructor(props) {
        super(props);

        this.state = {
            username: cookie.get('ordernet_username'),
            password: cookie.get('ordernet_password'),
            customerNumber: cookie.get('ordernet_customerNumber'),
            currentTab: 0,
            catalogs: null,

            statement: null,
            ageFrom: 'due',
            period1: 7,
            period2: 14,
            period3: 21,
            period4: 28,
            curStatementInvoiceNumber: null,

            userinfo: null,
            detail: null,
            fromDate: new Date(),
            toDate: new Date(),

            summary: null,
            fromSummary: new Date(),
            toSummary: new Date(),
            curSummaryInvioceNumber: null,

            currentinvoice: null,
            invoices: null,
            currentinvno: "",
        };

        this.getCatalog = this.getCatalog.bind(this);
        this.getStatement = this.getStatement.bind(this);
        this.onCurrentInvoiceChange = this.onCurrentInvoiceChange.bind(this);
        this.onPeriodChange = this.onPeriodChange.bind(this);
    }

    handleFromDateChanged = date => {
        this.setState({fromDate: date});
    }

    handleToDateChanged = date => {
        this.setState({toDate: date});
    }

    handleFromSummaryChanged = date => {
        this.setState({fromSummary: date});
    }

    handleToSummaryChanged = date => {
        this.setState({toSummary: date});
    }

    async componentDidMount() {
        this.getCatalog();
        this.getInvoices();
    }

    async getInvoices() {
        const { username, password, customerNumber } = this.state;
        await axios({
            method: 'post',
            url: `${APIInfo.serverUrl}${APIInfo.apiContext}${APIInfo.version}${APIInfo.getInvoices}`,
            data: {
                username: username,
                password: password,
                customerNumber: customerNumber,
            },
        })
        .then((res) => {
            let { invoices, selectedinvoice } = res.data;
            this.setState({invoices: invoices});
        })
        .catch((err) => {
            console.log(err);
        })        
    }

    async getCatalog() {
        const { username, password, customerNumber } = this.state;
        await axios({
            method: 'post',
            url: `${APIInfo.serverUrl}${APIInfo.apiContext}${APIInfo.version}${APIInfo.getCatalog}`,
            data: {
                username: username,
                password: password,
            },
        })
        .then((res) => {
            let catalogs = res.data.catalogs;
            this.setState({catalogs: catalogs});
        })
        .catch((err) => {
            console.log(err);
        })
    }

    async getStatement() {
        const { username, password, customerNumber, ageFrom, period1, period2, period3, period4 } = this.state;
        await axios({
            method: 'post',
            url: `${APIInfo.serverUrl}${APIInfo.apiContext}${APIInfo.version}${APIInfo.getStatement}`,
            data: {
                username: username,
                password: password,
                customerNumber: customerNumber,
                ageFrom: ageFrom,
                period1: period1,
                period2: period2,
                period3: period3,
                period4: period4,
            }
        })
        .then((res) => {
            let statement = res.data.statement;
            this.setState({statement: statement});
        })
        .catch((err) => {
            console.log(err);
        })
    }

    async getDetailInvoice() {
        let detail = [], userinfo = {}
        const { username, password, customerNumber, fromDate, toDate } = this.state;
        await axios({
            method: 'post',
            url: `${APIInfo.serverUrl}${APIInfo.apiContext}${APIInfo.version}${APIInfo.getInvoicesDetails}`,
            data: {
                username: username,
                password: password,
                customerNumber: customerNumber,
                fromDate: `${fromDate.getFullYear()}-${fromDate.getMonth()+1}-${fromDate.getDate()}`,
                toDate: `${toDate.getFullYear()}-${toDate.getMonth()+1}-${toDate.getDate()}`,
            }
        })
        .then((res) => {
            detail = res.data;
            //this.setState({detail: details});
        })
        .catch((err) => {
            console.log(err)
        });

        await axios({
            method: 'post',
            url: `${APIInfo.serverUrl}${APIInfo.apiContext}${APIInfo.version}${APIInfo.userInfo}`,
            data: {
                username: 'americ',
                password: 'americ',
            }
        })
        .then((res) => {
            userinfo = res.data.userinfo;
            //this.setState({userinfo: userinfo});
        })
        .catch((err) => {
            console.log(err)
        });

        this.setState({userinfo: userinfo, detail: detail});
    }

    async getInvoiceSummary() {
        let summary = [], userinfo = {};
        const { username, password, customerNumber, fromSummary, toSummary } = this.state;
        await axios({
            method: 'post',
            url: `${APIInfo.serverUrl}${APIInfo.apiContext}${APIInfo.version}${APIInfo.getInvoiceSummary}`,
            data: {
                username: username,
                password: password,
                customerNumber: customerNumber,
                fromDate: `${fromSummary.getFullYear()}-${fromSummary.getMonth()+1}-${fromSummary.getDate()}`,
                toDate: `${toSummary.getFullYear()}-${toSummary.getMonth()+1}-${toSummary.getDate()}`,
            }
        })
        .then((res) => {
            summary = res.data;
            //this.setState({detail: details});
        })
        .catch((err) => {
            console.log(err)
        });

        await axios({
            method: 'post',
            url: `${APIInfo.serverUrl}${APIInfo.apiContext}${APIInfo.version}${APIInfo.userInfo}`,
            data: {
                username: 'americ',
                password: 'americ',
            }
        })
        .then((res) => {
            userinfo = res.data.userinfo;
            //this.setState({userinfo: userinfo});
        })
        .catch((err) => {
            console.log(err)
        });

        this.setState({userinfo: userinfo, summary: summary});
    }

    async getOneInvoice(currentinvno) {
        const { username, password, customerNumber } = this.state;
        
        await axios({
            method: 'post',
            url: `${APIInfo.serverUrl}${APIInfo.apiContext}${APIInfo.version}${APIInfo.getOneInvoice}`,
            data: {
                username: username,
                password: password,
                customerNumber: customerNumber,
                invoiceNumber: currentinvno,
            },
        })
        .then((res) => {
            let currentinvoice = res.data.selectedinvoice;
            this.setState({currentinvno: currentinvno, currentinvoice: currentinvoice, currentTab: 0});
        })
        .catch((err) => {
            console.log(err);
        })
    }

    onCurrentInvoiceChange(newInvoiceNumber) {
        if (newInvoiceNumber === null)
            return;
        this.getOneInvoice(newInvoiceNumber);
    }

    onPeriodChange(index, e) {
        if (index === 1)
            this.setState({period1: parseInt(e.target.value)});
        else if (index === 2)
            this.setState({period2: parseInt(e.target.value)});
        else if (index === 3)
            this.setState({period3: parseInt(e.target.value)});
        else if (index === 4)
            this.setState({period4: parseInt(e.target.value)});
    }

    render() {
        let { currentTab, catalogs, statement, detail, summary, userinfo, invoices, currentinvoice, currentinvno } = this.state;
        const wholePage = this;

        function ViewInvoice() {
            console.log(currentinvoice);

            if (invoices === null)
                return (<div></div>);

            let invoicelist = [];
            invoices.map(invoice => {
                let invdte = new Date(invoice.invoiceDate);
                invoicelist.push({
                    label: `Invoice No.${invoice.invoiceNumber} | Date: ${invdte.getMonth() + 1}/${invdte.getDate()}/${invdte.getFullYear()} | Total: \$${invoice.invoiceAmount}`,
                    //value: `Invoice No.${invoice.invoiceNumber} | Date: ${invdte.getMonth()}/${invdte.getDay()}/${invdte.getFullYear()} | Total: \$${invoice.invoiceAmount}`,
                    value: invoice.invoiceNumber,
                    key: invoice.invoiceNumber,
                });
            })

            return (<div>
                <div className="" style={{marginLeft: 0, marginBottom: 15}}>
                    <Dropdown options={invoicelist} value={currentinvno} placeholder='Select Invoice'
                        onChange={newInv => {wholePage.onCurrentInvoiceChange(newInv.value);}}
                        style={{ width:'45%', marginLeft: 10}}/>
                    <span style={{width: '5%', textAlign: 'center', marginLeft: 5, marginRight: 5}}>OR</span>
                    <input type="text" placeholder="Enter Invoice Number" style={{width:'45%', marginRight: 10}}/>
                </div>
                {
                    currentinvoice === null ? (<div></div>) : (
                        <div>
                            <div className="row" style={{marginLeft: 0, marginBottom:10, alignItems: 'normal'}}>
                                <div className="col-md-5" style={{marginTop: 5}}>
                                    <div className="ship-to">
                                        <div className="text-default"><b>SHIP TO</b></div>
                                        <div className="text-default">{currentinvoice.shippingCompany}</div>
                                        <div className="text-default">{currentinvoice.shippingAddress1}</div>
                                        <div className="text-default">{currentinvoice.shippingAddress2}</div>
                                        <div className="text-default">{`${currentinvoice.shippingCity} ${currentinvoice.shippingState} ${currentinvoice.shippingZip}`}</div>
                                    </div>
                                </div>
                                <div className="col-md-5" style={{marginTop: 5}}>
                                    <div className="ship-to">
                                        <div className="text-default"><b>SHIP TO</b></div>
                                        <div className="text-default">{currentinvoice.billingCompany}</div>
                                        <div className="text-default">{currentinvoice.billingAddress1}</div>
                                        <div className="text-default">{currentinvoice.billingAddress2}</div>
                                        <div className="text-default">{`${currentinvoice.billingCity} ${currentinvoice.billingState} ${currentinvoice.billingZip}`}</div>
                                    </div>
                                </div>
                                <div className="col-md-2" style={{marginTop: 5, fontSize: '0.75rem', textAlign: 'center'}}>
                                    <div style={{backgroundColor: 'rgba(249,159,67,1)', border: '1px solid black', borderRadius: '10px', padding: 15, marginBottom: 10}}>
                                        <div>INVOICE NO.</div>
                                        <div>{currentinvoice.invoiceNumber}</div>
                                    </div>
                                    <div style={{backgroundColor: '#F4F1F4', border: '1px solid black', borderRadius: '10px', padding: 15, marginBottom: 10}}>
                                        <div>INVOICE DATE</div>
                                        <div>
                                            {((new Date(currentinvoice.invoiceDate).getMonth() + 1) < 10 ? '0' : '') + (new Date(currentinvoice.invoiceDate).getMonth() + 1)}/
                                            {((new Date(currentinvoice.invoiceDate).getDate() < 10) ? '0' : '') + new Date(currentinvoice.invoiceDate).getDate()}/
                                            {new Date(currentinvoice.invoiceDate).getFullYear()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <table className="order-table table table-bordered table-condensed table-striped table-hover">
                                <thead>
                                    <tr>
                                        <th style={{width: '10%'}}>Quantity</th>
                                        <th style={{width: '30%'}}>Item</th>
                                        <th style={{width: '30%'}}>Description</th>
                                        <th style={{width: '10%'}}>U/M</th>
                                        <th style={{width: '20%'}}>Price</th>
                                        <th style={{width: '20%'}}>Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        currentinvoice.products.map(product => {
                                            return (<tr>
                                                <td>{product.quantity}</td>
                                                <td>{product.item}</td>
                                                <td>{product.description}</td>
                                                <td></td>
                                                <td>{product.price1}</td>
                                                <td>{product.quantity * product.price1}</td>
                                            </tr>);
                                        })
                                    }
                                </tbody>
                            </table>
                            <div className="row" style={{color: 'black', textAlign: 'center', marginTop: 10}}>
                                <div className="col-md-4" style={{marginTop: 5}}>
                                    <div style={{height: '3em', border: '1px solid gray', backgroundColor: '#f4f1f4', borderRadius: 10, marginBottom: 5}}>
                                        CUSTOMER NO.<br/>
                                        {currentinvoice.customerNumber}
                                    </div>

                                    <div style={{height: '3em', border: '1px solid gray', backgroundColor: '#f4f1f4', borderRadius: 10, marginBottom: 5}}>
                                        FOB<br/>
                                        {currentinvoice.fob}
                                    </div>

                                    <div style={{height: '3em', border: '1px solid gray', backgroundColor: '#f4f1f4', borderRadius: 10}}>
                                        SHIP VIA TRUCK<br/>
                                        {currentinvoice.shipVia}
                                    </div>
                                </div>
                                <div className="col-md-4" style={{marginTop: 5}}>
                                    <div style={{height: '3em', border: '1px solid gray', backgroundColor: '#f4f1f4', borderRadius: 10, marginBottom: 5}}>
                                        SLSM<br/>
                                        {currentinvoice.slsm}
                                    </div>

                                    <div style={{height: '3em', border: '1px solid gray', backgroundColor: '#f4f1f4', borderRadius: 10, marginBottom: 5}}>
                                        TERMS<br/>
                                        {currentinvoice.terms}
                                    </div>

                                    <div style={{height: '3em', border: '1px solid gray', backgroundColor: '#f4f1f4', borderRadius: 10}}>
                                        CUST PO NO.
                                        {currentinvoice.poNumber}
                                    </div>
                                </div>
                                <div className="col-md-4" style={{marginTop: 5, color: 'white'}}>
                                    <div style={{width: '100%', backgroundColor: 'rgba(181, 138, 0, 1)', padding: 10, border: '1px solid gray', borderRadius: 10}}>
                                        ORDER TOTALS<br/>
                                        Non-Taxable Subtotal<br/>
                                        { currentinvoice.subtotal === null ? 0 : currentinvoice.subtotal }
                                        Taxable Subtotal<br/>
                                        { currentinvoice.taxableSubtotal === null ? 0 : currentinvoice.taxableSubtotal }
                                        Tax<br/>
                                        { currentinvoice.taxRate === null ? 0 : currentinvoice.taxRate }
                                        Total Order<br/>
                                        { currentinvoice.total === null ? 0 : currentinvoice.total }
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }
            </div>);
        }

        function SummaryInvoice() {
            let { fromSummary, toSummary, curSummaryInvioceNumber } = wholePage.state;

            return (<div>
                <div className="row">
                    <div style={{marginRight: '5px'}}>
                        From&nbsp;
                        <DatePicker
                            ref = {component => {wholePage.fromSummaryRef = component;}}
                            //open={this.state.pickerOpen}
                            selected = {fromSummary}
                            onChange = {wholePage.handleFromSummaryChanged}
                            className = "date-picker"
                        />
                        <img src="../assets/calendar.png" style={{width:20, height:20}} onClick={() => {wholePage.fromDateRef.setOpen(true);}}/>
                    </div>
                    <div style={{marginRight: '5px'}}>
                        To&nbsp;
                        <DatePicker
                            ref = {component => {wholePage.toSummaryRef = component;}}
                            //open={this.state.pickerOpen}
                            selected = {toSummary}
                            onChange = {wholePage.handleToSummaryChanged}
                            className = "date-picker"
                        />
                        <img src="../assets/calendar.png" style={{width:20, height:20}} onClick={() => {wholePage.toDateRef.setOpen(true);}}/>
                    </div>
                    <div className="show-statement" style={{textAlign: 'center', marginTop: 20, marginBottom: 20,
                        padding: 15, width: 'fit-content', alignItems: 'center'}}
                        onClick={() => {wholePage.getInvoiceSummary();}}>
                        SHOW INVOICE SUMMARY
                    </div>                    
                </div>
                {
                    summary === null ? (<div></div>) : (<div>
                        <table className="order-table table table-bordered table-condensed table-striped table-hover" style={{emptyCells: 'show'}}>
                            <thead>
                                <tr>
                                    <th style={{width: '10%'}}>Invoice #</th>
                                    <th style={{width: '10%'}}>Order #</th>
                                    <th style={{width: '20%'}}>Invoice Date</th>
                                    <th style={{width: '10%'}}>Customer #</th>
                                    <th style={{width: '5%'}}>Ship To</th>
                                    <th style={{width: '30%'}}>Invoice Total</th>
                                    <th style={{width: '30%'}}>Sales Tax</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    summary.invoices.map(invoice => {
                                        let invdte = new Date(invoice.invoiceDate);
                                        return (<tr onClick={() => {wholePage.setState({curSummaryInvioceNumber: invoice.invoiceNumber})}}
                                        className={curSummaryInvioceNumber === invoice.invoiceNumber ? 'selected-row' : ''}>
                                            <td>{invoice.invoiceNumber}</td>
                                            <td>{invoice.orderNumber}</td>
                                            <td>{`${invdte.getMonth() + 1}/${invdte.getDate()}/${invdte.getFullYear()}`}</td>
                                            <td>{invoice.customerNumber}</td>
                                            <td>{invoice.shippingCompany}</td>
                                            <td>{invoice.invoiceAmount}</td>
                                            <td>{invoice.tax}</td>
                                        </tr>);
                                    })
                                }
                            </tbody>
                        </table>
                        <div className="row" style={{marginTop: 15}}>
                            <div className="col-md-3"/>
                            <div className="col-md-2">
                                <div style={{fontSize: '0.875rem', border: '1px solid gray', borderRadius: 10, color: 'white',
                                    backgroundColor: 'rgba(249,159,67,1)', padding: 5, textAlign: 'center'}}>
                                    INVOICES TOTAL<br/>
                                    {summary.allInvoicesTotal}
                                </div>
                            </div>
                            <div className="col-md-2">
                                <div style={{fontSize: '0.875rem', border: '1px solid gray', borderRadius: 10,
                                    backgroundColor: '#F4F1F4', padding: 5, textAlign: 'center'}}>
                                    SALES TAX TOTAL<br/>
                                    {summary.allInvoicesTotal}
                                </div>
                            </div>
                            <div className="col-md-2 show-statement" style={{height: '4em', lineHeight: '4em', verticalAlign: 'middle', textAlign: 'center',
                                color: 'blue', backgroundColor: '#F4F1F4', fontSize: '0.875rem'}} onClick={() => {wholePage.onCurrentInvoiceChange(wholePage.state.curSummaryInvioceNumber);}}>
                                VIEW INVOICE
                            </div>
                            <div className="col-md-3"/>
                        </div>
                    </div>)
                }
            </div>);
        }

        function DetailInvoice() {
            let date = new Date(), { fromDate, toDate } = wholePage.state;
            let year = date.getFullYear(), month = date.getMonth() + 1, day = date.getDate(), hour = date.getHours(), minute = date.getMinutes();
            return (<div>
                <div className="row">
                    <div style={{marginRight: '5px'}}>
                        From&nbsp;
                        <DatePicker
                            ref = {component => {wholePage.fromDateRef = component;}}
                            //open={this.state.pickerOpen}
                            selected = {fromDate}
                            onChange = {wholePage.handleFromDateChanged}
                            popperPlacement = "right-left"
                            className = "date-picker"
                        />
                        <img src="../assets/calendar.png" style={{width:20, height:20}} onClick={() => {wholePage.fromDateRef.setOpen(true);}}/>
                    </div>
                    <div style={{marginRight: '5px'}}>
                        To&nbsp;
                        <DatePicker
                            ref = {component => {wholePage.toDateRef = component;}}
                            //open={this.state.pickerOpen}
                            selected = {toDate}
                            onChange = {wholePage.handleToDateChanged}
                            popperPlacement = "right-left"
                            className = "date-picker"
                        />
                        <img src="../assets/calendar.png" style={{width:20, height:20}} onClick={() => {wholePage.toDateRef.setOpen(true);}}/>
                    </div>
                    <div className="show-statement" style={{textAlign: 'center', marginTop: 20, marginBottom: 20,
                        padding: 15, width: 'fit-content', alignItems: 'center'}}
                        onClick={() => {wholePage.getDetailInvoice();}}>
                        SHOW INVOICES
                    </div>
                    {
                        detail === null ? (<div></div>) : (<div style={{border: '1px solid gray', paddingLeft: 30, paddingRight: 30,
                            marginLeft: 15, borderRadius: 10, backgroundColor: 'rgba(249,159,67,1)'}}>
                            TOTAL ${detail.allInvoicesTotal}
                        </div>)
                    }
                </div>
                {
                    detail === null ? (<div></div>) : (<div>
                        <div>
                            Date: {`${month}/${day}/${year} at ${hour}:${minute}`}
                        </div>
                        <div style={{textAlign: 'center'}}>
                            <div>{userinfo.company}</div>
                            Detail Invoice Register
                            <div>Invoices From
                                {`${fromDate.getMonth() + 1}, ${fromDate.getDate()}, ${fromDate.getFullYear()}`} 
                                To {`${toDate.getMonth() + 1}, ${toDate.getDate()}, ${toDate.getFullYear()}`}
                            </div>
                            {
                                detail.invoices.map(invoice => {
                                    let invDate = new Date(invoice.invoiceDate);
                                    return (<div>
                                        <div style={{backgroundColor: 'lightgray'}}>
                                            Invoice No.{invoice.invoiceNumber} - Date:{invDate.getMonth() + 1, invDate.getDate(), invDate.getFullYear()}
                                        </div>
                                        <table className="table table-bordered table-condensed table-striped table-hover" style={{width: '100%'}}>
                                            <thead>
                                                <tr style={{textAlign: 'left', backgroundColor: 'black', color: 'white'}}>
                                                    <th style={{padding: 5, border: '1px solid gray'}}>Item</th>
                                                    <th style={{padding: 5, border: '1px solid gray'}}>Description</th>
                                                    <th style={{padding: 5, border: '1px solid gray'}}>Price</th>
                                                    <th style={{padding: 5, border: '1px solid gray'}}>Cost</th>
                                                    <th style={{padding: 5, border: '1px solid gray'}}>Qty Ship</th>
                                                    <th style={{padding: 5, border: '1px solid gray'}}>Ext Price</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    invoice.products.map(product => {
                                                        return (<tr>
                                                            <td style={{border: '1px solid gray'}}>{product.item}</td>
                                                            <td style={{border: '1px solid gray'}}>{product.description}</td>
                                                            <td style={{border: '1px solid gray'}}>{product.price1}</td>
                                                            <td style={{border: '1px solid gray'}}>{product.cost}</td>
                                                            <td style={{border: '1px solid gray'}}>{product.quantity}</td>
                                                            <td style={{border: '1px solid gray'}}>{product.extPrice}</td>
                                                        </tr>)
                                                    })
                                                }
                                                <tr style={{backgroundColor: 'black', color: 'white'}}>
                                                    <td colSpan="5" style={{padding: 5, textAlign: 'left', border: '1px solid gray'}}>Total</td>
                                                    <td style={{border: '1px solid gray'}}>{invoice.invoiceAmount}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>)
                                })
                            }
                            <div style={{backgroundColor: 'black', color: 'white'}}>ALL INVOICES TOTAL ${detail.allInvoicesTotal}</div>
                        </div>
                    </div>)
                }
            </div>);
        }

        function Statement() {
            let { curStatementInvoiceNumber } = wholePage.state;
            return (<div>
                <div className="row">
                    <div className="col-xs-1 col-sm-1 col-md-1"></div>
                    <div className="col-xs-3 col-sm-3 col-md-3">
                        <div style={{textAlign: "center", border: "1px solid black", borderRadius: 10,
                        paddingTop: 30, paddingBottom:30, marginTop: 15}}>
                            <div>AGE FROM</div>
                            <label style={{padding: 5}}>
                                <input type="radio" name="ageFrom" checked={wholePage.state.ageFrom === "due"}
                                    onClick={() => {wholePage.setState({ageFrom: "due"})}}/>
                                Due Date
                            </label>
                            <label style={{padding: 5}}>
                                <input type="radio" name="ageFrom" checked={wholePage.state.ageFrom === "invoice"}
                                    onClick={() => {wholePage.setState({ageFrom: "invoice"})}}/>
                                Invoice Date
                            </label>
                        </div>
                    </div>
                    <div className="col-xs-7 col-sm-7 col-md-7" style={{textAlign: "center", border: "1px solid black", borderRadius: 10,
                        paddingTop: 30, paddingBottom:30, marginTop: 15}}>
                        <div>BREAKDOWN</div>
                        Period1: <input type="text" style={{width: "10%"}} value={wholePage.state.period1} onChange={e => {wholePage.onPeriodChange(1, e)}}/>
                        Period2: <input type="text" style={{width: "10%"}} value={wholePage.state.period2} onChange={e => {wholePage.onPeriodChange(2, e)}}/>
                        Period3: <input type="text" style={{width: "10%"}} value={wholePage.state.period3} onChange={e => {wholePage.onPeriodChange(3, e)}}/>
                        Period4: <input type="text" style={{width: "10%"}} value={wholePage.state.period4} onChange={e => {wholePage.onPeriodChange(4, e)}}/>
                    </div>
                    <br/>
                    <div className="show-statement col-xs-4 col-sm-4 col-md-4" style={{marginLeft: 'auto', marginRight: 'auto',
                        lineHeight: '2em', verticalAlign: 'middle', textAlign: 'center', marginTop: 20, marginBottom: 20,
                        padding: 15, width: 'fit-content', alignItems: 'center'}} onClick={() => {wholePage.getStatement()}}>
                        SHOW STATEMENT
                    </div>
                </div>
                {
                    statement === null ? (<div></div>) : ( <div>
                        <div style={{marginLeft: 0, marginBottom:10, alignItems: 'normal'}}>
                            <div style={{float: 'left', padding: 5, marginBottom: 10, border: '1px solid black', borderRadius: 5, backgroundColor: '#F6F2F6', width: '75%'}}>
                                <div className="text-default"><b>BILL TO</b></div>
                                <div className="text-default">{statement.billingCompany}</div>
                                <div className="text-default">{statement.billingAddress1}</div>
                                <div className="text-default">{statement.billingAddress2}</div>
                                <div className="text-default">{`${statement.billingCity} ${statement.billingState} ${statement.billingZip}`}</div>
                            </div>
                            <div style={{float: 'left', width: '25%'}}>
                                <div style={{paddingLeft: 15, textAlign: 'center', fontWeight: 700}}>
                                    <div style={{backgroundColor: '#F4F1F4', border: '1px solid black', borderRadius: '10px', padding: 5,marginBottom: 10}}>
                                        <div>STATEMENT DATE</div>
                                        <div>{statement.statementDate}</div>
                                    </div>
                                    <div style={{backgroundColor: '#F4F1F4', border: '1px solid black', borderRadius: '10px', padding: 5, marginBottom: 10}}>
                                        <div>CUST NO</div>
                                        <div>{statement.customerNumber}</div>
                                    </div>
                                    <div style={{backgroundColor: 'rgba(249,159,67,1)', border: '1px solid black', borderRadius: '10px', padding: 5}}>
                                        <div>TOTAL</div>
                                        <div>{statement.customerNumber}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <table className="order-table table table-bordered table-condensed table-striped table-hover">
                            <thead>
                                <tr>
                                    <th style={{width: '40%'}}>Transaction Date</th>
                                    <th style={{width: '40%'}}>Invoice No.</th>
                                    <th style={{width: '40%'}}>Amount</th>
                                    <th style={{width: '40%'}}>Balance</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    statement.invoices.map(invoice => {
                                        let invdte = new Date(invoice.invoiceDate);
                                        return (<tr onClick={() => {
                                                wholePage.setState({curStatementInvoiceNumber: invoice.invoiceNumber})
                                            }} className={curStatementInvoiceNumber === invoice.invoiceNumber ? 'selected-row' : ''}>
                                            <td>{`${invdte.getMonth() + 1}/${invdte.getDate()}/${invdte.getFullYear()}`}</td>
                                            <td>{invoice.invoiceNumber}</td>
                                            <td>{invoice.invoiceAmount}</td>
                                            <td>{invoice.invoiceBalance}</td>
                                        </tr>);
                                    })
                                }
                            </tbody>
                        </table>
                        <div className="row" style={{color: 'white', textAlign: 'center', marginLeft: 0, marginTop: 10}}>
                            <div className="col-md-2">
                                <div style={{backgroundColor: '#90001C', borderRadius: 10, marginBottom: 5}}>
                                    CURRENT DUE<br/>
                                    ${statement.currentDue.toFixed(2)}
                                </div>
                            </div>
                            <div className="col-md-2">
                                <div style={{backgroundColor: '#0000A5', borderRadius: 10, marginBottom: 5}}>
                                    OVER {wholePage.state.period1}<br/>
                                    ${statement.period1Due.toFixed(2)}
                                </div>
                            </div>
                            <div className="col-md-2">
                                <div style={{backgroundColor: '#0041C6', borderRadius: 10, marginBottom: 5}}>
                                    OVER {wholePage.state.period2}<br/>
                                    ${statement.period2Due.toFixed(2)}
                                </div>
                            </div>
                            <div className="col-md-2">
                                <div style={{backgroundColor: '#3680CE', borderRadius: 10, marginBottom: 5}}>
                                    OVER {wholePage.state.period3}<br/>
                                    ${statement.period3Due.toFixed(2)}
                                </div>
                            </div>
                            <div className="col-md-2">
                                <div style={{backgroundColor: '#669FCE', borderRadius: 10, marginBottom: 5}}>
                                    OVER {wholePage.state.period4}<br/>
                                    ${statement.period4Due.toFixed(2)}
                                </div>
                            </div>
                            <div className="col-md-2">
                                <div className="show-statement" style={{backgroundColor: 'white', color: 'blue', marginBottom: 5}}
                                    onClick={() => {wholePage.onCurrentInvoiceChange(wholePage.state.curStatementInvoiceNumber)}}>
                                    VIEW INVOICE
                                </div>
                            </div>
                        </div>
                    </div>)
                }
            </div>);
        }

        function Catalog() {
            return catalogs === null ? (<div>)</div>) : (<div>
                {
                    catalogs.map(catalog => {
                        return catalog.length === 0 ? (<div></div>)
                        : (<div style={{borderRadius: 15, border: '1px solid gray', textAlign: 'center',
                            padding: '15px', width: '70%', marginLeft: '15%', marginBottom: 15}}>
                            <div style={{height: '1em', marginBottom: '1em'}}> {catalog[0].TBLDESC} </div>
                            <table style={{border: '1px solid black', width: '100%'}}>
                                <thead style={{backgroundColor: 'black', color: 'white'}}>
                                    <tr style={{textAlign: 'left'}}>
                                        <th style={{width: '80%'}}>Description</th>
                                        <th style={{width: '20%'}}>U/M</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        catalog.map(item => {
                                            return (<tr>
                                                <td style={{height: '2em', border: '1px solid black'}}>{item.DESCRIP}</td>
                                                <td style={{height: '2em', border: '1px solid black'}}>{item.UNITMS}</td>
                                            </tr>)
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>)
                    })
                }
            </div>);
        }

        function ReportBody() {
            if (currentTab === 0)
                return <ViewInvoice/>
            else if (currentTab === 1)
                return <SummaryInvoice/>
            else if (currentTab === 2)
                return <DetailInvoice/>
            else if (currentTab === 3)
                return <Statement/>
            else
                return <Catalog/>
        }

        return (
            <div>
                <Header currentPage={2}/>
                <div className="page" style={{fontSize: '0.5rem', borderTop: '2px solid #F4F1F4'}}>
                    <div className="row sub-header">
                        <div className={`sub-header-tab${currentTab === 0 ? '-active' : ''}`}
                            onClick={() => {this.setState({currentTab: 0});}}
                            style={{width:'20%'}}>
                            View Invoice
                        </div>
                        <div className={`sub-header-tab${currentTab === 1 ? '-active' : ''}`}
                            onClick={() => {this.setState({currentTab: 1});}}
                            style={{width:'20%'}}>
                            Summary Invoice Register
                        </div>
                        <div className={`sub-header-tab${currentTab === 2 ? '-active' : ''}`}
                            onClick={() => {this.setState({currentTab: 2});}}
                            style={{width:'20%'}}>
                            Detail Invoice Register
                        </div>
                        <div className={`sub-header-tab${currentTab === 3 ? '-active' : ''}`}
                            onClick={() => {this.setState({currentTab: 3});}}
                            style={{width:'20%'}}>
                            Statement of Account
                        </div>
                        <div className={`sub-header-tab${currentTab === 4 ? '-active' : ''}`}
                            onClick={() => {this.setState({currentTab: 4});}}
                            style={{width:'20%'}}>
                            Catalog
                        </div>
                    </div>
                    <div style={{width: '100%', marginTop: 20, padding: 15, alignItems: 'center'}}>
                        <ReportBody/>
                    </div>
                </div>
            </div>
        )
    }
}

export default ReportsPage;