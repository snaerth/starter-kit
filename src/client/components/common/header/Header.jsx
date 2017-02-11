import React, {Component} from 'react';
import {Link, IndexLink} from 'react-router';
import styles from './Header.scss';

class Header extends Component {
    render() {
        return (
            <nav className={styles.container}>
                <IndexLink
                    to="/"
                    activeClassName="active"
                    className={styles.home_link + ' ' + styles.link}>ICELANDIC MOVIE API</IndexLink>
                <div className={styles.links_right}>
                    <Link
                        to="/signin"
                        activeClassName="active"
                        className={styles.link}>Sign in</Link>
                    <Link
                        to="/signup"
                        activeClassName="active"
                        className={styles.link}>Sign up</Link>
                </div>
            </nav>
        );
    }
}

export default Header;