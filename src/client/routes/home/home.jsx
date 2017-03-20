import React, { Component } from 'react';
import MainHeading from '../../components/common/mainheading';

class HomePage extends Component {
    render() {
        return (
            <div>
                <MainHeading text="MY NEW HOMEPAGE" />
                <img src="assets/images/test.jpg" />
                <img src="/assets/images/test.jpg" />
                <img src="./assets/images/test.jpg" />
                <img src="/images/test.jpg" />
                <img src="images/test.jpg" />
                <img src="./images/test.jpg" />
            </div>
        );
    }
}

export default HomePage;