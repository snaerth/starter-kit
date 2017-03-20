import React, { Component } from 'react';
import MainHeading from '../../components/common/mainheading';

class HomePage extends Component {
    render() {
        return (
            <div>
                <MainHeading text="MY NEW HOMEPAGE" />
                <img src="images/test.png" />
            </div>
        );
    }
}

export default HomePage;