import React from 'react';

import APIInfo from '../Constants/API';

import Header from '../Layout/Header';
class ContactUsPage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Header currentPage={3}/>
                <div className="page text-center">
                    <div className="company-name">
                        100 Some Street
                    </div>
                    <div className="text-default">
                        Suite 333
                    </div>
                    <div className="text-default">
                        Los Angeles, CA, 90014
                    </div>
                    <div className="text-default">
                        USA
                    </div>
                    <div className="text-default">
                        Phone: (800)000-0000
                    </div>
                    <div className="text-default">
                        Fax: (800)000-0000
                    </div>
                    <div className="text-default text-link">
                        <a href={`mailto:sales@luckyproduce.com`}> sales@luckyproduce.com </a>
                    </div>
                    <div className="text-default text-link">
                        <a href={`https://www.LuckyProduce.com`}> www.LuckyProduce.com </a>
                    </div>
                </div>
            </div>
        )
    }
}

export default ContactUsPage;