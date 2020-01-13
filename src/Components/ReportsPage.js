import React from 'react';

import axios from 'axios';
import DatePicker from 'react-datepicker';
import Dropdown from 'react-dropdown';

import APIInfo from '../Constants/API';

import Header from '../Layout/Header';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-dropdown/style.css';

import cookie from 'js-cookie';
import { ColorContext } from './ColorProvider';

class ReportsPage extends React.Component {
    fromDateRef = null;
    toDateRef = null;
    fromSummaryRef = null;
    toSummaryRef = null;
    currentInvInputRef = null;

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

            isloading: false,
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
        this.getUserInfo();
        this.getInvoices();
    }

    async getInvoices() {
        this.setState({isloading: true});

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
            this.setState({invoices: invoices, isloading: false});
        })
        .catch((err) => {
            console.log(err);
            this.setState({isloading: false});
        })        
    }

    async getCatalog() {
        this.setState({isloading: true});

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
            this.setState({catalogs: catalogs, isloading: false});
        })
        .catch((err) => {
            console.log(err);
            this.setState({isloading: false});
        })
    }

    async getStatement() {
        this.setState({isloading: true});

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
            this.setState({statement: statement, isloading: false});
        })
        .catch((err) => {
            console.log(err);
            this.setState({isloading: false});
        })
    }

    async getUserInfo() {
        this.setState({isloading: true});

        let userinfo = {};
        const { username, password } = this.state;

        await axios({
            method: 'post',
            url: `${APIInfo.serverUrl}${APIInfo.apiContext}${APIInfo.version}${APIInfo.userInfo}`,
            data: {
                username: username,
                password: password,
            }
        })
        .then((res) => {
            userinfo = res.data.userinfo;
        })
        .catch((err) => {
            console.log(err)
        });

        this.setState({userinfo: userinfo, isloading: false});
    }

    async getDetailInvoice() {
        this.setState({isloading: true});

        let detail = [];
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

        this.setState({detail: detail, isloading: false});
    }

    async getInvoiceSummary() {
        this.setState({isloading: true});

        let summary = [];
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

        this.setState({summary: summary, isloading: false});
    }

    async getOneInvoice(currentinvno) {
        this.setState({isloading: true});

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
            this.setState({currentinvno: currentinvoice.invoiceNumber, currentinvoice: currentinvoice, currentTab: 0});
        })
        .catch((err) => {
            console.log(err);
        })

        this.setState({isloading: false});
    }

    onFindCurrentInvoice() {
        if (this.currentInvInputRef === null)
            return;

        let invInput = this.currentInvInputRef.value;
        if (invInput === null || invInput === "")
            return;

        this.getOneInvoice(invInput);
    }

    onCurrentInvoiceChange(newInvoiceNumber) {
        console.log(newInvoiceNumber);

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
        let { isloading, currentTab, catalogs, statement, detail, summary, userinfo, invoices, currentinvoice, currentinvno } = this.state;
        const wholePage = this;

        function ViewInvoice() {
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

            return (
                <ColorContext.Consumer>
                    {
                        context => {
                            let { colors } = context.state;
                            let back = colors.GridHeaderBack;

                            let red = parseInt(back.substr(1, 2), 16);
                            let green = parseInt(back.substr(3, 2), 16);
                            let blue = parseInt(back.substr(5, 2), 16);

                            return (
                                <div>
                                    <div className="" style={{width: "100%", marginLeft: 0, marginBottom: 15, display: "inline-flex", alignItems: "center"}}>
                                        <div style={{width: "35%"}}>
                                            <Dropdown options={invoicelist} value={currentinvno} placeholder='Select Invoice'
                                                onChange={newInv => {wholePage.onCurrentInvoiceChange(newInv.value);}}/>
                                        </div>
                                        <span style={{width: '5%', textAlign: 'center', marginLeft: 5, marginRight: 5}}>OR</span>
                                        <input type="text" placeholder="Enter Invoice Number"
                                            ref={inputItem => {wholePage.currentInvInputRef = inputItem}} style={{width:'35%', marginRight: 10}}/>
                                        <input type="button" value="GO" onClick={() => {wholePage.onFindCurrentInvoice()}}/>
                                        {
                                            currentinvoice !== null && <input type="button" style={{marginLeft: 25}} value="PRINT INVOICE" onClick={() => {printCurrentInvoice()}}/>
                                        }
                                    </div>
                                    {
                                        currentinvoice === null ? (<div></div>) : (
                                            <div>
                                                <div className="row" style={{marginBottom:10, alignItems: 'normal'}}>
                                                    <div className="col-md-5" style={{}}>
                                                        <div className="ship-to">
                                                            <div className="text-default"><b>SHIP TO</b></div>
                                                            <div className="text-default">{currentinvoice.shippingCompany}</div>
                                                            <div className="text-default">{currentinvoice.shippingAddress1}</div>
                                                            <div className="text-default">{currentinvoice.shippingAddress2}</div>
                                                            <div className="text-default">{`${currentinvoice.shippingCity} ${currentinvoice.shippingState} ${currentinvoice.shippingZip}`}</div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-5" style={{}}>
                                                        <div className="ship-to">
                                                            <div className="text-default"><b>BILL TO</b></div>
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
                                                    <div className="col-md-10">
                                                        <table className="order-table" style={{height: 600, display: 'block', emptyCells: 'show'}}>
                                                            <thead>
                                                                <tr>
                                                                    <th style={{width: '10%', background: `-webkit-linear-gradient(-90deg,  rgba(${red}, ${green}, ${blue}, 1) 0%, rgba(${red - 15}, ${green - 15}, ${blue - 15}, 1) 50%, rgba(${red - 30}, ${green - 30}, ${blue - 30}, 1) 100%)`}}>Quantity</th>
                                                                    <th style={{width: '30%', background: `-webkit-linear-gradient(-90deg,  rgba(${red}, ${green}, ${blue}, 1) 0%, rgba(${red - 15}, ${green - 15}, ${blue - 15}, 1) 50%, rgba(${red - 30}, ${green - 30}, ${blue - 30}, 1) 100%)`}}>Item</th>
                                                                    <th style={{width: '30%', background: `-webkit-linear-gradient(-90deg,  rgba(${red}, ${green}, ${blue}, 1) 0%, rgba(${red - 15}, ${green - 15}, ${blue - 15}, 1) 50%, rgba(${red - 30}, ${green - 30}, ${blue - 30}, 1) 100%)`}}>Description</th>
                                                                    <th style={{width: '10%', background: `-webkit-linear-gradient(-90deg,  rgba(${red}, ${green}, ${blue}, 1) 0%, rgba(${red - 15}, ${green - 15}, ${blue - 15}, 1) 50%, rgba(${red - 30}, ${green - 30}, ${blue - 30}, 1) 100%)`}}>U/M</th>
                                                                    <th style={{width: '20%', background: `-webkit-linear-gradient(-90deg,  rgba(${red}, ${green}, ${blue}, 1) 0%, rgba(${red - 15}, ${green - 15}, ${blue - 15}, 1) 50%, rgba(${red - 30}, ${green - 30}, ${blue - 30}, 1) 100%)`}}>Price</th>
                                                                    <th style={{width: '20%', background: `-webkit-linear-gradient(-90deg,  rgba(${red}, ${green}, ${blue}, 1) 0%, rgba(${red - 15}, ${green - 15}, ${blue - 15}, 1) 50%, rgba(${red - 30}, ${green - 30}, ${blue - 30}, 1) 100%)`}}>Amount</th>
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
                                                    </div>
                                                    <div className="col-md-2" style={{color: 'black', textAlign: 'center'}}>
                                                        <div className="" style={{marginTop: 5}}>
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
                                                        <div className="" style={{marginTop: 5}}>
                                                            <div style={{height: '3em', border: '1px solid gray', backgroundColor: '#f4f1f4', borderRadius: 10, marginBottom: 5}}>
                                                                SLSM<br/>
                                                                {currentinvoice.slsm}
                                                            </div>

                                                            <div style={{height: '3em', border: '1px solid gray', backgroundColor: '#f4f1f4', borderRadius: 10, marginBottom: 5}}>
                                                                TERMS<br/>
                                                                {currentinvoice.terms}
                                                            </div>

                                                            <div style={{height: '3em', border: '1px solid gray', backgroundColor: '#f4f1f4', borderRadius: 10}}>
                                                                CUST PO NO.<br/>
                                                                {currentinvoice.poNumber}
                                                            </div>
                                                        </div>
                                                        <div className="" style={{marginTop: 5, color: 'white'}}>
                                                            <div style={{width: '100%', backgroundColor: 'rgba(181, 138, 0, 1)', fontSize: "0.75rem",
                                                                padding: 10, border: '1px solid gray', borderRadius: 10}}>
                                                                ORDER TOTALS<br/>
                                                                Non-Taxable Subtotal<br/>
                                                                ${ currentinvoice.subtotal === null ? 0 : currentinvoice.subtotal }<br/>
                                                                Taxable Subtotal<br/>
                                                                ${ currentinvoice.taxableSubtotal === null ? 0 : currentinvoice.taxableSubtotal }<br/>
                                                                Tax<br/>
                                                                %{ currentinvoice.taxRate === null ? 0 : currentinvoice.taxRate }<br/>
                                                                Total Order<br/>
                                                                ${ currentinvoice.total === null ? 0 : currentinvoice.total }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div> 
                                            </div>
                                        )
                                    }
                                </div>
                            )
                        }
                    }
                </ColorContext.Consumer>
            );
        }

        function SummaryInvoice() {
            let { fromSummary, toSummary, curSummaryInvioceNumber } = wholePage.state;

            return (
                <ColorContext.Consumer>
                    {
                        context => {
                            let { colors } = context.state;
                            let back = colors.GridHeaderBack;

                            let red = parseInt(back.substr(1, 2), 16);
                            let green = parseInt(back.substr(3, 2), 16);
                            let blue = parseInt(back.substr(5, 2), 16);
                            return (
                                <div>
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
                                            <img src="/assets/calendar.png" style={{width:20, height:20}} onClick={() => {wholePage.fromDateRef.setOpen(true);}}/>
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
                                            <img src="/assets/calendar.png" style={{width:20, height:20}} onClick={() => {wholePage.toDateRef.setOpen(true);}}/>
                                        </div>
                                        <input type="button" value="SHOW INVOICE SUMMARY" onClick={() => {wholePage.getInvoiceSummary()}}/>
                                        {
                                            summary !== null && summary.invoices.length > 0 && <input type="button" style={{marginLeft: 10}} 
                                                value="PRINT SUMMARY" onClick={() => {printInvoiceSummary()}}/>
                                        }
                                        {/*<div className="show-statement" style={{textAlign: 'center', marginTop: 20, marginBottom: 20,
                                            padding: 15, width: 'fit-content', alignItems: 'center'}}
                                            onClick={() => {wholePage.getInvoiceSummary();}}>
                                            SHOW INVOICE SUMMARY
                                        </div>*/}
                                    </div>
                                    {
                                        (summary === null || summary.invoices.length === 0) ? (<div></div>) : (<div className="row" style={{alignItems: 'end', marginTop: 15}}>
                                            <table className="order-table col-md-10" style={{height: 600, display: 'block', padding: 0}}>
                                                <thead>
                                                    <tr>
                                                        <th style={{width: '10%', background: `-webkit-linear-gradient(-90deg,  rgba(${red}, ${green}, ${blue}, 1) 0%, rgba(${red - 15}, ${green - 15}, ${blue - 15}, 1) 50%, rgba(${red - 30}, ${green - 30}, ${blue - 30}, 1) 100%)`}}>Invoice #</th>
                                                        <th style={{width: '10%', background: `-webkit-linear-gradient(-90deg,  rgba(${red}, ${green}, ${blue}, 1) 0%, rgba(${red - 15}, ${green - 15}, ${blue - 15}, 1) 50%, rgba(${red - 30}, ${green - 30}, ${blue - 30}, 1) 100%)`}}>Order #</th>
                                                        <th style={{width: '20%', background: `-webkit-linear-gradient(-90deg,  rgba(${red}, ${green}, ${blue}, 1) 0%, rgba(${red - 15}, ${green - 15}, ${blue - 15}, 1) 50%, rgba(${red - 30}, ${green - 30}, ${blue - 30}, 1) 100%)`}}>Invoice Date</th>
                                                        <th style={{width: '15%', background: `-webkit-linear-gradient(-90deg,  rgba(${red}, ${green}, ${blue}, 1) 0%, rgba(${red - 15}, ${green - 15}, ${blue - 15}, 1) 50%, rgba(${red - 30}, ${green - 30}, ${blue - 30}, 1) 100%)`}}>Customer #</th>
                                                        <th style={{width: '15%', background: `-webkit-linear-gradient(-90deg,  rgba(${red}, ${green}, ${blue}, 1) 0%, rgba(${red - 15}, ${green - 15}, ${blue - 15}, 1) 50%, rgba(${red - 30}, ${green - 30}, ${blue - 30}, 1) 100%)`}}>Ship To</th>
                                                        <th style={{width: '30%', background: `-webkit-linear-gradient(-90deg,  rgba(${red}, ${green}, ${blue}, 1) 0%, rgba(${red - 15}, ${green - 15}, ${blue - 15}, 1) 50%, rgba(${red - 30}, ${green - 30}, ${blue - 30}, 1) 100%)`}}>Invoice Total</th>
                                                        <th style={{width: '5%', background: `-webkit-linear-gradient(-90deg,  rgba(${red}, ${green}, ${blue}, 1) 0%, rgba(${red - 15}, ${green - 15}, ${blue - 15}, 1) 50%, rgba(${red - 30}, ${green - 30}, ${blue - 30}, 1) 100%)`}}>Sales Tax</th>
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
                                            <div className="col-md-2">
                                                <div style={{width: '100%', marginBottom: 5}}>
                                                    <div style={{fontSize: '0.875rem', border: '1px solid gray', borderRadius: 10, color: 'white',
                                                        backgroundColor: 'rgba(249,159,67,1)', padding: 5, textAlign: 'center'}}>
                                                        INVOICES TOTAL<br/>
                                                        ${summary.allInvoicesTotal.toFixed(2)}
                                                    </div>
                                                </div>
                                                <div style={{width: '100%', marginBottom: 5}}>
                                                    <div style={{fontSize: '0.875rem', border: '1px solid gray', borderRadius: 10,
                                                        backgroundColor: '#F4F1F4', padding: 5, textAlign: 'center'}}>
                                                        SALES TAX TOTAL<br/>
                                                        ${summary.allTaxTotal.toFixed(2)}
                                                    </div>
                                                </div>
                                                <input type="button" style={{width: '100%', color: 'blue'}} value="VIEW INVOICE"
                                                    onClick={() => {wholePage.onCurrentInvoiceChange(wholePage.state.curSummaryInvioceNumber)}}/>
                                                {/*<div className="show-statement" style={{width: '100%', height: '4em',
                                                    lineHeight: '4em', verticalAlign: 'middle', textAlign: 'center',
                                                    color: 'blue', backgroundColor: '#F4F1F4', fontSize: '0.875rem'}}
                                                    onClick={() => {wholePage.onCurrentInvoiceChange(wholePage.state.curSummaryInvioceNumber);}}>
                                                    VIEW INVOICE
                                                </div>*/}
                                            </div>
                                        </div>)
                                    }
                                </div>
                            )
                        }
                    }
                </ColorContext.Consumer>
            );
        }

        function DetailInvoice() {
            let date = new Date(), { fromDate, toDate } = wholePage.state;
            let year = date.getFullYear(), month = date.getMonth() + 1, day = date.getDate(), hour = date.getHours(), minute = date.getMinutes();
            return (
                <ColorContext.Consumer>
                    {
                        context => {
                            let { colors } = context.state;
                            let back = colors.GridHeaderBack;

                        let red = parseInt(back.substr(1, 2), 16);
                        let green = parseInt(back.substr(3, 2), 16);
                        let blue = parseInt(back.substr(5, 2), 16);
                            return (
                                <div>
                                    <div className="row">
                                        <div style={{marginRight: '5px'}}>
                                            From&nbsp;
                                            <DatePicker
                                                ref = {component => {wholePage.fromDateRef = component;}}
                                                //open={this.state.pickerOpen}
                                                selected = {fromDate}
                                                onChange = {wholePage.handleFromDateChanged}
                                                
                                                className = "date-picker"
                                            />
                                            <img src="/assets/calendar.png" style={{width:20, height:20}} onClick={() => {wholePage.fromDateRef.setOpen(true);}}/>
                                        </div>
                                        <div style={{marginRight: '5px'}}>
                                            To&nbsp;
                                            <DatePicker
                                                ref = {component => {wholePage.toDateRef = component;}}
                                                //open={this.state.pickerOpen}
                                                selected = {toDate}
                                                onChange = {wholePage.handleToDateChanged}
                                                
                                                className = "date-picker"
                                            />
                                            <img src="/assets/calendar.png" style={{width:20, height:20}} onClick={() => {wholePage.toDateRef.setOpen(true);}}/>
                                        </div>
                                        <input type="button" value="SHOW INVOICES WITH DETAILS" onClick={() => {wholePage.getDetailInvoice()}}/>
                                        {/*<div className="show-statement" style={{textAlign: 'center', marginTop: 20, marginBottom: 20,
                                            padding: 15, width: 'fit-content', alignItems: 'center'}}
                                            onClick={() => {wholePage.getDetailInvoice();}}>
                                            SHOW INVOICES
                                        </div>*/}
                                        {
                                            (detail === null || detail.invoices.length === 0) ? (<div></div>) : (<div>
                                                <input type="button" value="PRINT" style={{marginLeft: 15}} onClick={() => {printDetailInvoice()}} />
                                                <span style={{border: '1px solid gray', paddingLeft: 30, paddingRight: 30,
                                                    marginLeft: 15, borderRadius: 10, backgroundColor: 'rgba(249,159,67,1)'}}>
                                                    TOTAL ${detail.allInvoicesTotal.toFixed(2)}
                                                </span>
                                            </div>)
                                        }
                                    </div>
                                    {
                                        (detail === null || detail.invoices.length === 0) ? (<div>{ detail !== null && <div style={{textAlign: 'center', marginTop: 35}}>No Result</div>}</div>) : (<div>
                                            <div style={{textAlign: 'center', height: 700, overflowY: 'scroll'}}>
                                                {
                                                    detail.invoices.map((invoice, index) => {
                                                        let invDate = new Date(invoice.invoiceDate);
                                                        return (<div style={{backgroundColor: index % 2 === 0 ? "#00008B" : "#800080", marginTop: 15, padding: 15, borderRadius: 15}}>
                                                            <div style={{color: 'white', fontWeight: 900}}>
                                                                <span style={{float: 'left'}}>Invoice # {invoice.invoiceNumber}</span>
                                                                <span style={{textAlign: 'center'}}>
                                                                    {(invDate.getMonth() + 1) < 10 ? '0' : ''}{invDate.getMonth() + 1}
                                                                    /{invDate.getDate() < 10 ? '0' : ''}{invDate.getDate()}
                                                                    /{invDate.getFullYear()}
                                                                </span>
                                                                <span>
                                                                    <input type="button" value="VIEW INVOICE" style={{float: 'right'}}
                                                                        onClick={() => {wholePage.onCurrentInvoiceChange(invoice.invoiceNumber)}}/>
                                                                </span>
                                                            </div>
                                                            <table className="order-table" style={{width: '100%', textAlign: 'left'}}>
                                                                <thead>
                                                                    <tr style={{backgroundColor: 'black'}}>
                                                                        <th style={{width: '25%', border: '1px solid gray', background: `-webkit-linear-gradient(-90deg,  rgba(${red}, ${green}, ${blue}, 1) 0%, rgba(${red - 15}, ${green - 15}, ${blue - 15}, 1) 50%, rgba(${red - 30}, ${green - 30}, ${blue - 30}, 1) 100%)`}}>Item</th>
                                                                        <th style={{width: '40%', border: '1px solid gray', background: `-webkit-linear-gradient(-90deg,  rgba(${red}, ${green}, ${blue}, 1) 0%, rgba(${red - 15}, ${green - 15}, ${blue - 15}, 1) 50%, rgba(${red - 30}, ${green - 30}, ${blue - 30}, 1) 100%)`}}>Description</th>
                                                                        <th style={{width: '11%', border: '1px solid gray', background: `-webkit-linear-gradient(-90deg,  rgba(${red}, ${green}, ${blue}, 1) 0%, rgba(${red - 15}, ${green - 15}, ${blue - 15}, 1) 50%, rgba(${red - 30}, ${green - 30}, ${blue - 30}, 1) 100%)`}}>Price</th>
                                                                        <th style={{width: '11%', border: '1px solid gray', background: `-webkit-linear-gradient(-90deg,  rgba(${red}, ${green}, ${blue}, 1) 0%, rgba(${red - 15}, ${green - 15}, ${blue - 15}, 1) 50%, rgba(${red - 30}, ${green - 30}, ${blue - 30}, 1) 100%)`}}>Qty Ship</th>
                                                                        <th style={{width: '13%', border: '1px solid gray', background: `-webkit-linear-gradient(-90deg,  rgba(${red}, ${green}, ${blue}, 1) 0%, rgba(${red - 15}, ${green - 15}, ${blue - 15}, 1) 50%, rgba(${red - 30}, ${green - 30}, ${blue - 30}, 1) 100%)`}}>Ext Price</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {
                                                                        invoice.products.map(product => {
                                                                            return (<tr>
                                                                                <td style={{border: '1px solid gray'}}>{product.item}</td>
                                                                                <td style={{border: '1px solid gray'}}>{product.description}</td>
                                                                                <td style={{border: '1px solid gray'}}>{product.price1.toFixed(2)}</td>
                                                                                <td style={{border: '1px solid gray'}}>{product.quantity}</td>
                                                                                <td style={{border: '1px solid gray'}}>{(product.price1 * product.quantity).toFixed(2)}</td>
                                                                            </tr>)
                                                                        })
                                                                    }
                                                                </tbody>
                                                            </table>
                                                            <div style={{fontWeight: 700, textAlign: 'right', paddingRight: 40, color: 'white'}}>
                                                                TOTAL {invoice.invoiceAmount.toFixed(2)}
                                                            </div>
                                                        </div>)
                                                    })
                                                }
                                            </div>
                                        </div>)
                                    }
                                </div>
                            )
                        }
                    }
                </ColorContext.Consumer>
            );
        }

        function Statement() {
            let { curStatementInvoiceNumber } = wholePage.state;
            return (
                <ColorContext.Consumer>
                    {
                        context => {
                            let { colors } = context.state;
                            let back = colors.GridHeaderBack;

                            let red = parseInt(back.substr(1, 2), 16);
                            let green = parseInt(back.substr(3, 2), 16);
                            let blue = parseInt(back.substr(5, 2), 16);
                            return (
                                <div>
                                    <div style={{display: 'inline-flex', fontSize: '0.8rem', justifyContent: 'space-evenly', alignItems: 'center'}}>
                                        <div style={{textAlign: "center", border: "1px solid black", borderRadius: 10,
                                        padding: 10}}>
                                            <div style={{fontWeight:700, marginBottom: 5}}>AGE FROM</div>
                                            <label>
                                                <input type="radio" name="ageFrom" checked={wholePage.state.ageFrom === "due"}
                                                    onClick={() => {wholePage.setState({ageFrom: "due"})}}/>
                                                Due Date
                                            </label>
                                            <label style={{marginLeft: 10}}>
                                                <input type="radio" name="ageFrom" checked={wholePage.state.ageFrom === "invoice"}
                                                    onClick={() => {wholePage.setState({ageFrom: "invoice"})}}/>
                                                Invoice Date
                                            </label>
                                        </div>
                                        <div style={{textAlign: "center", border: "1px solid black", borderRadius: 10,
                                            width: '50%', padding: 10}}>
                                            <div style={{fontWeight:700, marginBottom: 5}}>BREAKDOWN</div>
                                            Period1: <input type="text" style={{width: "10%"}} value={wholePage.state.period1} onChange={e => {wholePage.onPeriodChange(1, e)}}/>&nbsp;
                                            Period2: <input type="text" style={{width: "10%"}} value={wholePage.state.period2} onChange={e => {wholePage.onPeriodChange(2, e)}}/>&nbsp;
                                            Period3: <input type="text" style={{width: "10%"}} value={wholePage.state.period3} onChange={e => {wholePage.onPeriodChange(3, e)}}/>&nbsp;
                                            Period4: <input type="text" style={{width: "10%"}} value={wholePage.state.period4} onChange={e => {wholePage.onPeriodChange(4, e)}}/>&nbsp;
                                        </div>
                                        <div>
                                            <div>
                                                <input type="button" onClick={() => {wholePage.getStatement()}} value="SHOW STATEMENT"/>
                                            </div>
                                            {
                                                statement !== null && <div><br/><input type="button" onClick={() => {printStatement()}} value="PRINT STATEMENT"/></div>
                                            }
                                        </div>
                                    </div>
                                    {
                                        statement === null ? (<div></div>) : ( <div>
                                            <div className="row" style={{marginTop:10, alignItems: 'normal'}}>
                                                <div className="col-md-10" style={{float: 'left', padding: 5, marginBottom: 10, border: '1px solid black',
                                                    borderRadius: 5, backgroundColor: '#F6F2F6', height: 'fit-content'}}>
                                                    <div className="text-default"><b>BILL TO</b></div>
                                                    <div className="text-default">{statement.billingCompany}</div>
                                                    <div className="text-default">{statement.billingAddress1}</div>
                                                    <div className="text-default">{statement.billingAddress2}</div>
                                                    <div className="text-default">{`${statement.billingCity} ${statement.billingState} ${statement.billingZip}`}</div>
                                                </div>
                                                <div className="col-md-2">
                                                    <div style={{textAlign: 'center', fontSize: '0.75rem', fontWeight: 900}}>
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
                                                            <div>${(statement.currentDue + statement.period1Due + statement.period2Due +
                                                                statement.period3Due + statement.period4Due).toFixed(2)}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row" style={{marginTop: 10, alignItems: 'flex-start'}}>
                                                <table className="order-table col-md-10">
                                                    <thead>
                                                        <tr>
                                                            <th style={{width: '40%', background: `-webkit-linear-gradient(-90deg,  rgba(${red}, ${green}, ${blue}, 1) 0%, rgba(${red - 15}, ${green - 15}, ${blue - 15}, 1) 50%, rgba(${red - 30}, ${green - 30}, ${blue - 30}, 1) 100%)`}}>Transaction Date</th>
                                                            <th style={{width: '40%', background: `-webkit-linear-gradient(-90deg,  rgba(${red}, ${green}, ${blue}, 1) 0%, rgba(${red - 15}, ${green - 15}, ${blue - 15}, 1) 50%, rgba(${red - 30}, ${green - 30}, ${blue - 30}, 1) 100%)`}}>Invoice No.</th>
                                                            <th style={{width: '40%', background: `-webkit-linear-gradient(-90deg,  rgba(${red}, ${green}, ${blue}, 1) 0%, rgba(${red - 15}, ${green - 15}, ${blue - 15}, 1) 50%, rgba(${red - 30}, ${green - 30}, ${blue - 30}, 1) 100%)`}}>Amount</th>
                                                            <th style={{width: '40%', background: `-webkit-linear-gradient(-90deg,  rgba(${red}, ${green}, ${blue}, 1) 0%, rgba(${red - 15}, ${green - 15}, ${blue - 15}, 1) 50%, rgba(${red - 30}, ${green - 30}, ${blue - 30}, 1) 100%)`}}>Balance</th>
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
                                                <div className="col-md-2" style={{color: 'white', textAlign: 'center', fontSize: '0.75rem', fontWeight: 900}}>
                                                    <div className="">
                                                        <div style={{backgroundColor: '#90001C', borderRadius: 10, border: '1px solid black', marginBottom: 10}}>
                                                            CURRENT DUE<br/>
                                                            ${statement.currentDue.toFixed(2)}
                                                        </div>
                                                    </div>
                                                    <div className="">
                                                        <div style={{backgroundColor: '#0000A5', borderRadius: 10, border: '1px solid black', marginBottom: 10}}>
                                                            OVER {wholePage.state.period1}<br/>
                                                            ${statement.period1Due.toFixed(2)}
                                                        </div>
                                                    </div>
                                                    <div className="">
                                                        <div style={{backgroundColor: '#0041C6', borderRadius: 10, border: '1px solid black', marginBottom: 10}}>
                                                            OVER {wholePage.state.period2}<br/>
                                                            ${statement.period2Due.toFixed(2)}
                                                        </div>
                                                    </div>
                                                    <div className="">
                                                        <div style={{backgroundColor: '#3680CE', borderRadius: 10, border: '1px solid black', marginBottom: 10}}>
                                                            OVER {wholePage.state.period3}<br/>
                                                            ${statement.period3Due.toFixed(2)}
                                                        </div>
                                                    </div>
                                                    <div className="">
                                                        <div style={{backgroundColor: '#669FCE', borderRadius: 10, border: '1px solid black', marginBottom: 10}}>
                                                            OVER {wholePage.state.period4}<br/>
                                                            ${statement.period4Due.toFixed(2)}
                                                        </div>
                                                    </div>
                                                    <div className="">
                                                        <input type="button" style={{color: 'blue', width: '100%', paddingTop: 5, paddingBottom: 5}} value="VIEW INVOICE"
                                                            onClick={() => {wholePage.onCurrentInvoiceChange(wholePage.state.curStatementInvoiceNumber)}}/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>)
                                    }
                                </div>
                            )
                        }
                    }
                </ColorContext.Consumer>
            );
        }

        function Catalog() {
            return catalogs === null ? (<div></div>) : (
                <ColorContext.Consumer>
                    {
                        context => {
                            let { colors } = context.state;
                            let back = colors.GridHeaderBack;

                            let red = parseInt(back.substr(1, 2), 16);
                            let green = parseInt(back.substr(3, 2), 16);
                            let blue = parseInt(back.substr(5, 2), 16);
                            return (
                                <div>
                                    {
                                        catalogs.map(catalog => {
                                            return catalog.length === 0 ? <div></div>
                                            : (<div style={{borderRadius: 15, border: '1px solid gray',
                                                padding: '15px', width: '70%', marginLeft: '15%', marginBottom: 15}}>
                                                <div style={{height: '1em', marginBottom: '1em'}}> {catalog[0].TBLDESC} </div>
                                                <table style={{border: '1px solid black', fontSize: '0.75rem', width: '100%'}}>
                                                    <thead style={{backgroundColor: 'black', color: 'white'}}>
                                                        <tr>
                                                            <th style={{width: '90%', textAlign: 'left', paddingLeft: 5}}>Description</th>
                                                            <th style={{width: '10%', textAlign: 'center'}}>U/M</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            catalog.map(item => {
                                                                return (<tr>
                                                                    <td style={{height: '1em', border: '1px solid black', textAlign: 'left', paddingLeft: 5}}>{item.DESCRIP}</td>
                                                                    <td style={{height: '1em', border: '1px solid black', textAlign: 'center'}}>{item.UNITMS}</td>
                                                                </tr>)
                                                            })
                                                        }
                                                    </tbody>
                                                </table>
                                            </div>)
                                        })
                                    }
                                </div>
                            )
                        }
                    }
                </ColorContext.Consumer>
            );
        }

        function printCatalog() {
            let date = new Date();
            let year = date.getFullYear(), month = date.getMonth() + 1, day = date.getDate();
            let hour = date.getHours(), minute = date.getMinutes();

            let printform = document.getElementById('printform');

            printform.contentWindow.document.write('<HTML style="-webkit-print-color-adjust: exact;"><head>');
            printform.contentWindow.document.write(`<style>
                    table, th, td {
                        border: 1px solid gray;
                        border-collapse: collapse;
                        padding-left: 10px;
                    }
                    thead {
                        background-color: black;
                        color: white;
                    }
                </style>`);
            printform.contentWindow.document.write('</head>');
            printform.contentWindow.document.write('<body>');
            printform.contentWindow.document.write(`<div>Date: ${month < 10 ? '0' : ''}${month} / ${day < 10 ? '0' : ''}${day} / ${year}
                ${hour < 10 ? '0' : ''}${hour}:${minute < 10 ? '0' : ''}${minute}</div>`);
            printform.contentWindow.document.write(`<div style="text-align:center;">${userinfo.company}</div>`);
            printform.contentWindow.document.write(`<div style="text-align:center;">CATALOG</div>`);

            printform.contentWindow.document.write(document.getElementById('catalogView').innerHTML);

            printform.contentWindow.document.write('</body></html>');

            printform.contentWindow.document.close();
            printform.contentWindow.focus();

            printform.contentWindow.print();
            printform.contentWindow.close();
        }

        function printStatement() {
            let { statement, period1, period2, period3, period4, ageFrom } = wholePage.state;
            if (statement === null)
                return;

            let totalDue = statement.currentDue + statement.period1Due + statement.period2Due + statement.period3Due + statement.period4Due;

            let date = new Date();
            let year = date.getFullYear(), month = date.getMonth() + 1, day = date.getDate();
            let hour = date.getHours(), minute = date.getMinutes();

            let printform = document.getElementById('printform');

            printform.contentWindow.document.write('<HTML style="-webkit-print-color-adjust: exact;"><head>');
            printform.contentWindow.document.write(`<style>
                    table, th, td {
                        border: 1px solid gray;
                        border-collapse: collapse;
                        padding-left: 10px;
                    }
                    thead {
                        background-color: black;
                        color: white;
                    }
                </style>`);
            printform.contentWindow.document.write('</head>');
            printform.contentWindow.document.write('<body style="padding:20px;">');
            printform.contentWindow.document.write(`<div style="min-height:1em;text-align:center;">${userinfo.custno}</div>`);
            printform.contentWindow.document.write(`<div style="min-height:1em;text-align:center;">Statement of Account</div>`);
            printform.contentWindow.document.write(`<div style="min-height:1em;text-align:center;">Statement Date: ${month < 10 ? '0' : ''}${month}/${day < 10 ? '0' : ''}${day}/${year}</div>`);
            printform.contentWindow.document.write(`<div style="min-height:1em;text-align:center;">Age From : ${ageFrom === 'due' ? 'Due Date' : 'Invoice Date'}
                | Breakdown: ${period1}, ${period2}, ${period3}, ${period4}
                </div>`);
                
            printform.contentWindow.document.write(`<div style="border: 1px solid black;border-radius: 5px;padding: 15;margin-top: 20;">
                    BILL TO
                    <div>${statement.billingCompany}</div>
                    <div>${statement.billingAddress1}</div>
                    <div>${statement.billingAddress2}</div>
                    <div>${statement.billingCity} ${statement.billingState} ${statement.billingZip}</div>
                </div>`);

            printform.contentWindow.document.write(`<table style="width: 100%;margin-top: 20px;">`);
            printform.contentWindow.document.write(`<thead><tr><td>Transaction Date</td><td>Invoice No</td><td>Amount</td><td>Balance</td></tr></thead>`);
            printform.contentWindow.document.write(`<tbody>`)
            statement.invoices.map(invoice => {
                let invdte = new Date(invoice.invoiceDate);
                printform.contentWindow.document.write(`<tr>`);
                printform.contentWindow.document.write(`<td>${invdte.getMonth() < 10 ? '0' : ''}${invdte.getMonth()}/${invdte.getDate() < 10 ? '0' : ''}${invdte.getDate()}/${invdte.getFullYear()}</td>`);
                printform.contentWindow.document.write(`<td>${invoice.invoiceNumber}</td>`);
                printform.contentWindow.document.write(`<td>${invoice.invoiceAmount.toFixed(2)}</td>`);
                printform.contentWindow.document.write(`<td>${invoice.invoiceBalance.toFixed(2)}</td>`);
                printform.contentWindow.document.write(`</tr>`);
            });
            printform.contentWindow.document.write(`<tr style="background-color: #DDDDDD;color: white;"><td colspan=3>Current Due</td><td>${statement.currentDue.toFixed(2)}</td></tr>`);
            printform.contentWindow.document.write(`<tr style="background-color: #DDDDDD;color: white;"><td colspan=3>OVER ${period1}</td><td>${statement.period1Due.toFixed(2)}</td></tr>`);
            printform.contentWindow.document.write(`<tr style="background-color: #DDDDDD;color: white;"><td colspan=3>OVER ${period2}</td><td>${statement.period2Due.toFixed(2)}</td></tr>`);
            printform.contentWindow.document.write(`<tr style="background-color: #DDDDDD;color: white;"><td colspan=3>OVER ${period3}</td><td>${statement.period3Due.toFixed(2)}</td></tr>`);
            printform.contentWindow.document.write(`<tr style="background-color: #DDDDDD;color: white;"><td colspan=3>OVER ${period4}</td><td>${statement.period4Due.toFixed(2)}</td></tr>`);
            printform.contentWindow.document.write(`<tr style="background-color: #000000;color: white;"><td colspan=3>Total Due</td><td>${totalDue.toFixed(2)}</td></tr>`);
            printform.contentWindow.document.write(`</tbody></table>`);
            printform.contentWindow.document.write('</body></html>');

            printform.contentWindow.document.close();
            printform.contentWindow.focus();

            printform.contentWindow.print();
            printform.contentWindow.close();
        }

        function printDetailInvoice() {
            let { detail, fromDate, toDate } = wholePage.state;
            if (detail === null || detail.invoices.length === 0)
                return;

            let printform = document.getElementById('printform');

            printform.contentWindow.document.write('<HTML style="-webkit-print-color-adjust: exact;"><head>');
            printform.contentWindow.document.write(`<style>
                    table, th, td {
                        border: 1px solid gray;
                        border-collapse: collapse;
                        padding-left: 10px;
                    }
                </style>`);
            printform.contentWindow.document.write('</head>');
            printform.contentWindow.document.write('<body style="padding:20px;">');
            printform.contentWindow.document.write(`<div style="min-height:1em;text-align:center;">${userinfo.company}</div>`);
            printform.contentWindow.document.write(`<div style="min-height:1em;text-align:center;">Detail Invoice Register</div>`);
            printform.contentWindow.document.write(`<div style="min-height:1em;text-align:center;">
                    Invoices From: ${(fromDate.getMonth()+1) < 10 ? '0' : ''}${(fromDate.getMonth()+1)}/${fromDate.getDate() < 10 ? '0' : ''}${fromDate.getDate()}/${fromDate.getFullYear()}
                    To: ${(toDate.getMonth()+1) < 10 ? '0' : ''}${(toDate.getMonth()+1)}/${toDate.getDate() < 10 ? '0' : ''}${toDate.getDate()}/${toDate.getFullYear()}
                </div>`);
            printform.contentWindow.document.write(`<div style="min-height:1em;text-align:center;">Active Invoices</div>`);
            
            detail.invoices.map(invoice => {
                let invDate = new Date(invoice.invoiceDate);

                printform.contentWindow.document.write(`<div style="background: gray; margin-top: 15px;">`);
                printform.contentWindow.document.write(`<div style="width: 100%;text-align: center;">Invoice No. ${invoice.invoiceNumber}
                    - Date ${(invDate.getMonth() + 1) < 10 ? '0' : ''}${invDate.getMonth() + 1}
                    /${invDate.getDate() < 10 ? '0' : ''}${invDate.getDate()}
                    /${invDate.getFullYear()}</div>`);
                printform.contentWindow.document.write(`<table style="background-color: white;width: 100%;">`);
                printform.contentWindow.document.write(`<thead style="background-color: black;color: white;"><tr><td>Item</td><td>Description</td><td>Price</td>
                    <td>Cost</td><td>Qty Ship</td><td>Ext Price</td></tr></thead>`);
                printform.contentWindow.document.write(`<tbody>`);
                invoice.products.map(product => {
                    printform.contentWindow.document.write(`<tr>`);
                    printform.contentWindow.document.write(`<td>${product.item}</td>`);
                    printform.contentWindow.document.write(`<td>${product.description}</td>`);
                    printform.contentWindow.document.write(`<td>$${product.price1.toFixed(2)}</td>`);
                    printform.contentWindow.document.write(`<td>${product.cost}</td>`);
                    printform.contentWindow.document.write(`<td>${product.quantity}</td>`);
                    printform.contentWindow.document.write(`<td>${(product.price1 * product.quantity).toFixed(2)}</td>`);
                    printform.contentWindow.document.write(`</tr>`);
                });
                printform.contentWindow.document.write(`<tr style="background: black; color: white;">`);
                printform.contentWindow.document.write(`<td colspan=5>Total</td>`);
                printform.contentWindow.document.write(`<td>$${invoice.invoiceAmount.toFixed(2)}</td>`);
                printform.contentWindow.document.write(`</tr>`);
                printform.contentWindow.document.write(`</tbody>`);
                printform.contentWindow.document.write(`</table>`);
                printform.contentWindow.document.write(`</div>`);
            });
            printform.contentWindow.document.write(`<div style="align-text: center;margin-top: 15px;background: black;color: white;">ALL INVOICES TOTAL $${detail.allInvoicesTotal.toFixed(2)}</div>`);
            printform.contentWindow.document.write('</body></html>');

            printform.contentWindow.document.close();
            printform.contentWindow.focus();

            printform.contentWindow.print();
            printform.contentWindow.close();
        }

        function printInvoiceSummary() {
            let { fromSummary, toSummary, summary } = wholePage.state;
            if ( summary === null || summary.invoices.length === 0) return;

            let printform = document.getElementById('printform');

            printform.contentWindow.document.write('<HTML style="-webkit-print-color-adjust: exact;"><head>');
            printform.contentWindow.document.write(`<style>
                    table, th, td {
                        border: 1px solid gray;
                        border-collapse: collapse;
                        padding-left: 10px;
                    }
                </style>`);
            printform.contentWindow.document.write('</head>');
            printform.contentWindow.document.write('<body style="padding:20px;">');
            printform.contentWindow.document.write(`<div style="min-height:1em;text-align:center;">${userinfo.company}</div>`);
            printform.contentWindow.document.write(`<div style="min-height:1em;text-align:center;">Summary Invoice Register</div>`);
            printform.contentWindow.document.write(`<div style="min-height:1em;text-align:center;">
                    Invoices From: ${(fromSummary.getMonth()+1) < 10 ? '0' : ''}${(fromSummary.getMonth()+1)}/${fromSummary.getDate() < 10 ? '0' : ''}${fromSummary.getDate()}/${fromSummary.getFullYear()}
                    To: ${(toSummary.getMonth()+1) < 10 ? '0' : ''}${(toSummary.getMonth()+1)}/${toSummary.getDate() < 10 ? '0' : ''}${toSummary.getDate()}/${toSummary.getFullYear()}
                </div>`);
            printform.contentWindow.document.write(`<div style="min-height:1em;text-align:center;">Active Invoices</div>`);
            
            printform.contentWindow.document.write(`
                    <table style="width: 100%; margin-top: 15px;">
                        <thead style="background: black; color: white;">
                            <tr>
                                <th>Inv No.</th>
                                <th>Order No.</th>
                                <th>Inv Date</th>
                                <th>Customer No.</th>
                                <th>Ship To</th>
                                <th>Inv Total</th>
                                <th>Sales Tax</th>
                            </tr>
                        </thead>
                        <tbody>
            `);

            summary.invoices.map(invoice => {
                let invDate = new Date(invoice.invoiceDate);

                printform.contentWindow.document.write(`
                    <tr>
                        <td>${invoice.invoiceNumber}</td>
                        <td>${invoice.orderNumber}</td>
                        <td>${(invDate.getMonth() + 1) < 10 ? '0' : ''}${invDate.getMonth() + 1}
                        /${invDate.getDate() < 10 ? '0' : ''}${invDate.getDate()}
                        /${invDate.getFullYear()}</td>
                        <td>${invoice.customerNumber}</td>
                        <td>${invoice.shippingCompany}</td>
                        <td>$${invoice.invoiceAmount.toFixed(2)}</td>
                        <td>$${invoice.tax.toFixed(2)}</td>
                    </tr>
                `);
            });

            printform.contentWindow.document.write(`
                <tr style="background: black; color: white;">
                    <td colspan=5>Total</td>
                    <td>$${summary.allInvoicesTotal.toFixed(2)}</td>
                    <td>$${summary.allTaxTotal.toFixed(2)}</td>
                </tr>
            `);

            printform.contentWindow.document.write(`
                        </tbody>
                    </table>
            `);

            
            printform.contentWindow.document.write('</body></html>');

            printform.contentWindow.document.close();
            printform.contentWindow.focus();

            printform.contentWindow.print();
            printform.contentWindow.close();
        }

        function printCurrentInvoice() {
            let { currentinvoice } = wholePage.state;
            let invDate = new Date(currentinvoice);
            let day = invDate.getDate(), month = invDate.getMonth() + 1, year = invDate.getFullYear();

            let printform = document.getElementById('printform');

            printform.contentWindow.document.write('<HTML style="-webkit-print-color-adjust: exact;"><head>');
            printform.contentWindow.document.write(`<style>
                    table, th, td {
                        border: 1px solid gray;
                        border-collapse: collapse;
                        padding-left: 10px;
                    }
                </style>`);
            printform.contentWindow.document.write('</head>');
            printform.contentWindow.document.write('<body style="padding:20px;">');

            printform.contentWindow.document.write(`<div style="width: 100%;display: flex">`);

            printform.contentWindow.document.write(`<div style="width: 50%;margin-top: 15px;">`);
            printform.contentWindow.document.write(`<div>Invoice No. ${currentinvoice.invoiceNumber}</div>`);
            printform.contentWindow.document.write(`<div>Invoice Date: ${day < 10 ? '0' : ''}${day}/${month < 10 ? '0' : ''}${month}/${year}</div>`);
            printform.contentWindow.document.write(`<div>Customer No. ${currentinvoice.customerNumber}</div>`);
            printform.contentWindow.document.write(`<div>Customer PO No. ${currentinvoice.poNumber}</div>`);
            printform.contentWindow.document.write(`</div>`);

            printform.contentWindow.document.write(`<div style="width: 50%;text-align:right;">`);
            printform.contentWindow.document.write(`<div>FOB: ${currentinvoice.fob === null ? '' : currentinvoice.fob}</div>`);          
            printform.contentWindow.document.write(`<div>SLSM: ${currentinvoice.slsm}</div>`);
            printform.contentWindow.document.write(`<div>Ship Via: ${currentinvoice.shipVia}</div>`);
            printform.contentWindow.document.write(`<div>TERMS: ${currentinvoice.terms}</div>`);
            printform.contentWindow.document.write(`</div>`);

            printform.contentWindow.document.write(`</div>`);

            printform.contentWindow.document.write(`<div style="width: 100%;display:flex;">`);

            printform.contentWindow.document.write(`<div style="padding: 15px;width: 45%;border: 1px solid black;border-radius:15px">`);
            printform.contentWindow.document.write(`<div style="min-height: 1em;">SHIP TO</div>`);
            printform.contentWindow.document.write(`<div style="min-height: 1em;">${currentinvoice.shippingCompany}</div>`);
            printform.contentWindow.document.write(`<div style="min-height: 1em;">${currentinvoice.shippingAddress1}</div>`);
            printform.contentWindow.document.write(`<div style="min-height: 1em;">${currentinvoice.shippingAddress2}</div>`);
            printform.contentWindow.document.write(`<div style="min-height: 1em;">${currentinvoice.shippingCity} ${currentinvoice.shippingState} ${currentinvoice.shippingZip}</div>`);
            printform.contentWindow.document.write(`</div>`);
            
            printform.contentWindow.document.write(`<div style="padding: 15px;width: 45%;border: 1px solid black;border-radius:15px">`);
            printform.contentWindow.document.write(`<div style="min-height: 1em;">BILL TO</div>`);
            printform.contentWindow.document.write(`<div style="min-height: 1em;">${currentinvoice.billingCompany}</div>`);
            printform.contentWindow.document.write(`<div style="min-height: 1em;">${currentinvoice.billingAddress1}</div>`);
            printform.contentWindow.document.write(`<div style="min-height: 1em;">${currentinvoice.billingAddress2}</div>`);
            printform.contentWindow.document.write(`<div style="min-height: 1em;">${currentinvoice.billingCity} ${currentinvoice.billingState} ${currentinvoice.billingZip}</div>`);
            printform.contentWindow.document.write(`</div>`);

            printform.contentWindow.document.write(`</div>`);

            printform.contentWindow.document.write(`
                    <table style="margin-top: 15px;width:100%;">
                        <thead style="background: black; color: white;">
                            <tr>
                                <th>Qty</th>
                                <th>Item</th>
                                <th>Description</th>
                                <th>U/M</th>
                                <th>Price</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
            `);

            currentinvoice.products.map(product => {
                printform.contentWindow.document.write(`
                    <tr>
                        <td>${product.quantity}</td>
                        <td>${product.item}</td>
                        <td>${product.description}</td>
                        <td></td>
                        <td>${product.price1}</td>
                        <td>${product.quantity * product.price1}</td>
                    </tr>
                `);
            })

            printform.contentWindow.document.write(`
                        <tr>
                            <td colspan=5>Non-Taxable Subtotal</td>
                            <td>$${ currentinvoice.subtotal === null ? 0 : currentinvoice.subtotal }</td>
                        </tr>
                        <tr>
                            <td colspan=5>Taxable Subtotal</td>
                            <td>$${ currentinvoice.taxableSubtotal === null ? 0 : currentinvoice.taxableSubtotal }</td>
                        </tr>
                        <tr>
                            <td colspan=5>Tax</td>
                            <td>%${ currentinvoice.taxRate === null ? 0 : currentinvoice.taxRate }</td>
                        </tr>
                        <tr style="background: black;color: white">
                            <td colspan=5>Total</td>
                            <td>$${ currentinvoice.total === null ? 0 : currentinvoice.total }</td>
                        </tr>
                        </tbody>
                    </table>
            `);

            printform.contentWindow.document.write('</body></html>');

            printform.contentWindow.document.close();
            printform.contentWindow.focus();

            printform.contentWindow.print();
            printform.contentWindow.close();
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
            else {
                return <div>
                    <div style={{textAlign: 'center', marginBottom: 15}}>
                        <input type="button"value="PRINT CATALOG" onClick={() => {printCatalog()}}/>
                    </div>
                    <div id="catalogView">
                        <Catalog/>
                    </div>
                </div>
            }
        }

        return (
            <div>
                <Header currentPage={2}/>
                <iframe id="printform" style={{display: 'none', width: '100%'}}/>
                <div className="page" style={{fontSize: '1rem', borderTop: '2px solid #F4F1F4'}}>
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
                        {
                            isloading === true ? <div className="text-center" style={{marginTop: '10%'}}>
                                Loading Data. Please wait...
                            </div> : <ReportBody/>
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default ReportsPage;