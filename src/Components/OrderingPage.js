import React from 'react';

import axios from 'axios';
import DatePicker from 'react-datepicker';
import Dropdown from 'react-dropdown';

import APIInfo from '../Constants/API';

import Header from '../Layout/Header';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-dropdown/style.css';

import cookie from 'js-cookie';

class OrderingPage extends React.Component {
    deliveryDateRef = null;
    quantumRef = null;

    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            username: cookie.get('ordernet_username'),
            password: cookie.get('ordernet_password'),
            customer: {},
            orgProducts: [],
            products: [],
            deliveryDate: new Date(),
            pickerOpen: false,

            searchKey: '',
            isProfileItems: true,
            filterCode: null,

            isReviewMode: false,

            curSelectedItem: null,
            currentQuantum: 0,
            currentRowItem: null,

            quantum: {},

            orderID: '',

            isCommentEditing: false,
            custComments: '',

            custPONum: '',

            totalItems: 0,
            totalCost: 0,

            issubmit: false,
        }

        this.initializeData = this.initializeData.bind(this);

        this.initializeData();
    }

    onProductCodeChange = newCode => {
        this.setState({filterCode: newCode.value});
    }

    onSearchKeyChange(searchKey) {
        /*let { isProfileItems, orgProducts } = this.state;
        let products = [];
        orgProducts.forEach(function(orgOne) {
            if (isProfileItems !== true || orgOne.S === '*') {
                if (orgOne.item.toUpperCase().match(searchKey.toUpperCase()) || orgOne.descrip.toUpperCase().match(searchKey.toUpperCase()))
                    products.push(orgOne);
            }
        });
        this.setState({products: products});*/
        this.setState({searchKey: searchKey});
    }

    onChangeIsProfile() {
        /*let { isProfileItems, orgProducts } = this.state;
        isProfileItems = !isProfileItems;
        let products = [];
        orgProducts.forEach(function(orgOne) {
            if (isProfileItems !== true || orgOne.S === '*')
                products.push(orgOne);
        });
        this.setState({products: products, isProfileItems: isProfileItems});*/
        this.setState({isProfileItems: !this.state.isProfileItems});
    }

    applySearchFilter() {
        let { quantum, orgProducts, filterCode, searchKey, isProfileItems, isReviewMode } = this.state;
        let products = [];

        if (filterCode !== null) {
            filterCode = JSON.parse(filterCode);
            filterCode.TBLCHAR = filterCode.TBLCHAR.trim();
            filterCode.TBLDESC = filterCode.TBLDESC.trim();
        }

        orgProducts.forEach(function(orgOne){
            if (isReviewMode === true) {
                if (quantum[orgOne.item] === undefined && quantum[orgOne.item] === 0);
                else
                    products.push(orgOne);
            }
            else {
                if (filterCode !== null && !(orgOne.Category.toUpperCase().match(filterCode.TBLCHAR.toUpperCase())
                    && orgOne.descrip.toUpperCase().match(filterCode.TBLDESC.toUpperCase()))){}
                else if (isProfileItems === true && orgOne.S !== '*'){}
                else if (!(orgOne.item.toUpperCase().match(searchKey.toUpperCase()) || orgOne.descrip.toUpperCase().match(searchKey.toUpperCase()))){}
                else
                    products.push(orgOne);
            }
        });

        return products;
    }

    async initializeData() {
        await axios({
            method: 'post',
            url: `${APIInfo.serverUrl}${APIInfo.apiContext}${APIInfo.version}${APIInfo.customer}`,
            data: {
                username: this.state.username,
                password: this.state.password,
                isProfileItems: this.state.isProfileItems,
                searchKey: this.state.searchKey,
            }
        })
        .then((response) => {
            let data = response.data;
            let codes = data.productcodes, productcodes = [];
            
            let allProducts = {TBLCHAR: '', TBLDESC: ''};

            productcodes.push({
                label: 'ALL PRODUCTS',
                value: JSON.stringify(allProducts),
            })

            codes.forEach(function(code) {
                productcodes.push({
                    /*key: code.TBLDESC + code.TBLCHAR,
                    value: code.TBLDESC + code.TBLCHAR,*/
                    label: code.TBLDESC + code.TBLCHAR,
                    value: JSON.stringify(code),
                });
            })

            this.setState({customer: data.userinfo, orgProducts: data.products, productcodes: productcodes, isLoading: false});
        })
        .catch((err) => {
            console.log(err);
        });
    }

    componentDidMount() {
    }

    componentDidUpdate() {
        if (this.quantumRef !== null) {
            this.quantumRef.focus();
        }
    }

    handleDevelieryDateChanged = date => {
        this.setState({
            deliveryDate: date
        });
    }

    onCurRowChanged = (newSelectedItem) => {
        this.setState({currentRowItem: newSelectedItem});
        this.setState({curSelectedItem: null, currentQuantum: 0})
    }

    onSelectedRowChanged = (newSelectedItem) => {
        let { quantum, curSelectedItem, currentQuantum } = this.state;

        if (curSelectedItem !== null && curSelectedItem.item === newSelectedItem.item) {
            quantum[curSelectedItem.item] = parseFloat(currentQuantum);
            this.setState({quantum: quantum, currentQuantum: 0, curSelectedItem: null});
            return;
        }

        if (curSelectedItem !== null)
            quantum[curSelectedItem.item] = parseFloat(currentQuantum);

        this.setState({currentRowItem: newSelectedItem, curSelectedItem: newSelectedItem, quantum: quantum,
            currentQuantum: quantum[newSelectedItem.item] === undefined ? 0 : quantum[newSelectedItem.item]});
    }

    onCurQuanChanged = e => {
        let currentQuantum = e.target.value;
        this.setState({currentQuantum: currentQuantum});
    }

    onPONumChanged = e => {
        this.setState({custPONum: e.target.value});
    }

    clearEntireOrder = () => {
        this.setState({currentQuantum: 0, curSelectedItem: null, isReviewMode: false, quantum: {}});
    }

    completeOrder = () => {
        let { deliveryDate, quantum, orgProducts, username, password, custComments, custPONum } = this.state;

        let product_info = [], totalPrice = 0;

        orgProducts.map(product => {
            if (quantum[product.item] !== undefined && quantum[product.item] > 0) {
                product_info.push({
                    'quantity': quantum[product.item],
                    'item': product.item,
                    'price1': product.Price1,
                    'upccode': product.Category,
                    'descrip': product.descrip,
                });
                totalPrice += quantum[product.item] * product.Price1;
            }
        });

        this.setState({issubmit: true});

        axios({
            url: `${APIInfo.serverUrl}${APIInfo.apiContext}${APIInfo.version}${APIInfo.submitOrder}`,
            method: 'post',
            data: {
                products: product_info,
                username: username,
                password: password,
                custComments: custComments,
                custPONum: custPONum,
                shipDate: `${deliveryDate.getFullYear()}-${deliveryDate.getMonth() + 1}-${deliveryDate.getDate()}`,
            }
        })
        .then((res) => {
            let orderID = res.data.orderID;
            this.setState({orderID: orderID, totalItems: product_info.length, totalCost: totalPrice, issubmit: false });
        })
        .catch((err) => {
            console.log(err);
            this.setState({issubmit: false});
        })
    }

    commentChanged = e => {
        this.setState({custComments: e.target.value})
    }

    custPONumChanged = e => {
        this.setState({custPONum: e.target.value})
    }

    render() {
        if (this.state.isLoading === true) {
            return (<div>
                <Header currentPage={0}/>
                <div className="page">
                    <div className="text-center" style={{marginTop: '10%'}}>
                        Loading data. Please wait....
                    </div>
                </div>
            </div>)
        }

        let products = this.applySearchFilter();
        
        let { isProfileItems, deliveryDate, orderID, customer, productcodes, quantum, filterCode, issubmit, currentRowItem,
            currentQuantum, curSelectedItem, isReviewMode, custPONum, totalCost, totalItems, custComments } = this.state;
        let totalPrice = 0;
        let curSelectedRow = null;
        if (curSelectedItem !== null)
            curSelectedRow = curSelectedItem.item;

        if (issubmit === true) {
            return (<div>
                <Header currentPage={0}/>
                <div className="page">
                    <div className="text-center" style={{marginTop: '10%'}}>
                        Creating order. Please wait...
                    </div>
                </div>
            </div>)
        }

        return (
            <div>
                <Header currentPage={0}/>
                <div className="page">
                    {
                        orderID === "" ? <div></div> : <div style={{color: 'red'}}>Thank you for your order.</div>
                    }
                    <div className="row margin-bottom-5">
                        <div className="col-md-5">
                            <div className="ship-to text-default">
                                <div className="text-default"><b>SHIP TO</b></div>
                                <div className="text-default">{customer.company}</div>
                                <div className="text-default">{customer.address1}</div>
                                <div className="text-default">{customer.address2}</div>
                                <div className="text-default">{`${customer.city} ${customer.state} ${customer.zip}`}</div>
                            </div>
                        </div>
                        <div className="col-md-5">
                            <div className="bill-to text-default">
                                <div className="text-default"><b>BILL TO</b></div>
                                <div className="text-default">{customer.billingcompany}</div>
                                <div className="text-default">{customer.billingaddress1}</div>
                                <div className="text-default">{customer.billingaddress2}</div>
                                <div className="text-default">{`${customer.billingcity} ${customer.billingstate} ${customer.billingzip}`}</div>
                            </div>
                        </div>
                        <div className="col-md-2"/>
                        <div className="input-caption col-md-2">Delivery Date</div>
                        <div className="input-caption col-md-2">PO Number</div>
                        <div className="input-caption col-md-3">Search</div>
                        <div className="col-md-5"/>
                        <div className="col-md-2">
                            <DatePicker
                                ref = {component => {this.deliveryDateRef = component;}}
                                selected = {this.state.deliveryDate}
                                onChange = {this.handleDevelieryDateChanged}
                                minDate = {new Date()}
                                className = "calendar-width-fix"
                            />
                        </div>
                        <div className="col-md-2">
                            <input type="text" style={{maxWidth: '100%'}} onChange={(e) => {this.onPONumChanged(e);}}/>
                        </div>
                        <div className="col-md-3">
                            <input type="text" style={{maxWidth: '100%'}} onChange={(e) => {this.onSearchKeyChange(e.target.value);}}/>
                        </div>
                        <div className="col-md-3">
                            <Dropdown onChange={newVal => this.onProductCodeChange(newVal)} 
                                value={filterCode} options={productcodes} placeholder = 'ALL PRODUCTS'/>
                        </div>
                    </div>
                    <div className="row" style={{alignItems: "flex-start"}}>
                        <div className="col-md-10">
                            <div className={orderID === "" ? "" : "col-md-2"}>
                                {
                                    orderID === "" ? (<div></div>) : (<div style={{textAlign: 'center'}}>
                                        <div style={{marginTop: 10, border: '1px solid black', height: '3em', backgroundColor: '#F4F1F4', borderRadius: 5}}>
                                            DELIVERY DATE<br/>
                                            {deliveryDate.getMonth()+1}/{deliveryDate.getDate()}/{deliveryDate.getFullYear()}
                                        </div>
                                        <div style={{marginTop: 10, border: '1px solid black', height: '3em', backgroundColor: '#F4F1F4', borderRadius: 5}}>
                                            PO NUMBER<br/>
                                            {custPONum}
                                        </div>
                                        <div style={{border: '1px solid black', height: '3em', color: 'white', backgroundColor: 'rgba(255,155,0,1)', borderRadius: 5}}>
                                            ORDER NUMBER<br/>
                                            {orderID}
                                        </div>
                                    </div>)
                                }
                            </div>
                            
                                <table className="order-table" style={{fontSize: '0.75rem', height: 600, display: 'block', emptyCells: 'show'}}>
                                    <thead>
                                        <tr>
                                            <th style={{width: '5%'}}>QTY</th>
                                            <th style={{width: '3%'}}>U/M</th>
                                            <th style={{width: '5%'}}>PACK</th>
                                            <th style={{width: '40%'}}>DESCRIPTION</th>
                                            <th style={{width: '10%'}}>PRICE</th>
                                            <th style={{width: '5%'}}>EXT.PRICE</th>
                                            <th style={{width: '5%'}}>ITEM</th>
                                            <th style={{width: '3%'}}>CODE</th>
                                            <th style={{width: '2%'}}></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            products.map(product => {
                                                if (quantum[product.item] !== undefined && quantum[product.item] > 0)
                                                    totalPrice += quantum[product.item] * product.Price1;
                                                else if (isReviewMode === true || orderID !== "")
                                                    return (<tr></tr>);

                                                return (<tr className={curSelectedRow === product.item || (curSelectedRow === null && currentRowItem !== null && currentRowItem.item === product.item) ? 'selected-row'
                                                : ((quantum[product.item] !== undefined && quantum[product.item] > 0) ? 'quanted-row' : '')}>
                                                    <td>
                                                        {
                                                            product.item === curSelectedRow ? <input ref={(input) => {this.quantumRef = input}}
                                                                type="text" style={{width: '100%'}}
                                                                value = {currentQuantum}
                                                                onKeyUp={e => {if (e.keyCode === 13) { this.onSelectedRowChanged(product) }}}
                                                                onChange={e => {e.preventDefault();e.stopPropagation(); this.onCurQuanChanged(e)}}/> : 
                                                                <div onClick={() => {this.onSelectedRowChanged(product)}}>
                                                                    {(quantum[product.item] !== undefined && quantum[product.item] > 0) ? quantum[product.item] : 0}
                                                                </div>
                                                        }
                                                    </td>
                                                    <td onClick={() => {this.onCurRowChanged(product)}}>{product.size}</td>
                                                    <td onClick={() => {this.onCurRowChanged(product)}}>{product.Pack}</td>
                                                    <td onClick={() => {this.onCurRowChanged(product)}}>{product.descrip}</td>
                                                    <td onClick={() => {this.onCurRowChanged(product)}}>${parseFloat(product.Price1).toFixed(2)}</td>
                                                    <td onClick={() => {this.onCurRowChanged(product)}}>${quantum[product.item] !== undefined
                                                        ? (quantum[product.item] * parseFloat(product.Price1)).toFixed(2) : "0.00"}</td>
                                                    <td onClick={() => {this.onCurRowChanged(product)}}>{product.item}</td>
                                                    <td onClick={() => {this.onCurRowChanged(product)}}>{product.Category}</td>
                                                    <td onClick={() => {this.onCurRowChanged(product)}}>{product.S}</td>
                                                </tr>);
                                            })
                                        }
                                    </tbody>
                                </table>
                        </div>
                        <div className="col-md-2">
                            {   orderID === "" ? (<div className="row" style={{}}>
                                    <div class="col-md-12" style={{borderRadius: 5, backgroundColor: '#FFA000', border: '0.5px solid gray',
                                        fontWeight: 700, color: '#FFFFFF', marginBottom: 10, textAlign: 'center'}}>
                                        ORDER TOTAL<br/>${totalPrice.toFixed(2)}
                                    </div>
                                    <div class="col-md-12" style={{textAlign: 'left', padding: 0, display: isReviewMode ? 'none' : 'block'}}>
                                        <label onClick={() => {this.onChangeIsProfile();}}>
                                            {
                                                isProfileItems === false ? <input type="checkbox" /> : <input type="checkbox" checked/>
                                            }
                                            PROFILE ITEMS
                                        </label>
                                    </div>
                                    <input type="button" style={{width: "100%", marginBottom: 5}} 
                                        onClick={() => {this.setState({isReviewMode: !isReviewMode})}}
                                        value={ isReviewMode === false ? 'Review Order' : 'Continue Ordering'}/>
                                    <input type="button" style={{color: 'red', width: "100%", marginBottom: 5}} 
                                        onClick={() => {this.completeOrder()}} value="Complete Order"/>
                                    <div class="col-md-12" style={{padding: 0}}>
                                        <div style={{fontSize: "0.8rem", textAlign: 'left'}}>Enter comments here:</div>
                                        <textarea style={{height: '10em', resize: 'none',
                                            backgroundColor: '#F4F1F4', borderRadius: 5}}
                                            onChange={e => {this.commentChanged(e)}} onClick={() => {this.setState({isCommentEditing: true})}}/>
                                    </div>
                                    <input type="button" style={{color: 'red', width: "100%", marginBottom: 5}} 
                                        onClick={() => {this.clearEntireOrder()}} value="Clear Entire Order"/>
                                <div style={{fontSize: '0.75rem', width: '100%', minHeight: '150px', backgroundColor: '#B58A00', color: '#FFFFFF', borderRadius: 10, textAlign: 'center'}}>
                                    {
                                        currentRowItem === null ? (<div></div>) : (<div style={{lineHeight: '3em'}}>
                                            <div>{currentRowItem.item}</div>
                                            <div>{currentRowItem.descrip}</div>
                                            <div>PRICE ${parseFloat(currentRowItem.Price1).toFixed(2)}</div>
                                            <div>QUANTITY {quantum[currentRowItem.item] === undefined ? 0 : quantum[currentRowItem.item]}</div>
                                        </div>)
                                    }
                                </div>
                            </div>) : (<div className="row" style={{textAlign: 'center'}}>
                                <div className="col-md-4">
                                    <div style={{border: '1px solid black', borderRadius: 5}}>
                                        TOTAL ITEMS<br/>
                                        {totalItems}
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div style={{border: '1px solid black', borderRadius: 5}}>
                                        TOTAL PRICE<br/>
                                        {totalCost.toFixed(2)}
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div style={{border: '1px solid black', borderRadius: 5, padding: 5}}>
                                        COMMENTS<br/>
                                        <div style={{height: '3em', border: '1px solid black', width: '80%', margin: 'auto'}}>
                                            {custComments}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-12 make-new-order" style={{marginTop: 15}}>
                                    <div style={{borderRadius: 5, height: '2em', border: '1px solid gray', width: '60%', margin: 'auto',
                                        backgroundColor: '#F4F1F4', textAlign: 'center'}}
                                        onClick={() => {this.setState({
                                            curSelectedItem: null,
                                            currentQuantum: 0,

                                            quantum: {},

                                            orderID: '',

                                            isCommentEditing: false,
                                            custComments: '',

                                            custPONum: '',

                                            totalItems: 0,
                                            totalCost: 0,
                                        })}}>
                                        MAKE NEW ORDER
                                    </div>
                                </div>
                            </div>)
                        }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default OrderingPage;