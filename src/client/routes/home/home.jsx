import React, { Component } from 'react';
import MainHeading from '../../components/common/mainheading';
import test from './test.jpg';

class HomePage extends Component {
    render() {
        return (
            <div>
                <MainHeading text="MY NEW HOMEPAGE" />
                <img src="images/test.jpg" />
                <img src="/images/test.jpg" />
                <img src="assets/images/test.jpg" />
                <img src="/assets/images/test.jpg" />
                <img src="./images/test.jpg" />
                <img src="./assets/images/test.jpg" />
                <img src="http://localhost:3000/images/test.jpg" />
                <img src="http://localhost:3000/assets/images/test.jpg" />
                --------------------
                <img src={test} />
            </div>
        );
    }
}

export default HomePage;