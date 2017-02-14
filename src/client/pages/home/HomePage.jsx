import React, {Component} from 'react';
import styles from './HomePage.scss';

class HomePage extends Component {
    render() {
        return (
            <div>
                <h1 className={styles.headingYellow}>ICELANDIC MOVIE API</h1>
            </div>
        );
    }
}

export default HomePage;