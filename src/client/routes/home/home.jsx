import React, { Component } from 'react';
import MainHeading from '../../components/common/mainheading';
import test from './test.jpg';

class HomePage extends Component {
    render() {
        return (
            <div>
                <MainHeading text="MY NEW HOMEPAGE" />
                <img src="assets/images/test.jpg" />
                <img src={test} />
            </div>
        );
    }
}

export default HomePage;