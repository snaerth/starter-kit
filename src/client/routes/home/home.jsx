import React, { Component } from 'react';
import MainHeading from '../../components/common/mainheading';
import styles from './home.scss';
import CircleImage from '../../components/common/circleImage';
import classnames from 'classnames';

class HomePage extends Component {
    render() {
        return (
            <div className="container">
                <MainHeading text="MY NEW HOMEPAGE" />
                <div className={styles.grid}>
                    <div className={classnames(styles.card, styles.cardLeft)}>
                        <CircleImage src="images/users/Snær_Seljan_Þóroddsson-1489854732152.jpg" alt="Mynd af bla" className={styles.profileImage} />
                        <p className={styles.name}>Snær Seljan Þóroddsson</p>
                        <a href="mailto:snaerth@gmail.com" title="Send email to snaerth@gmail.com" className="link-slideright">snaerth@gmail.com</a>
                    </div>
                    <div className={styles.card}>
                        <h2 className={styles.noMarginTop}>Extra information</h2>
                    </div>
                </div>
            </div>
        );
    }
}

export default HomePage;