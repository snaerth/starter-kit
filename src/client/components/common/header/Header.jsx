import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link, IndexLink } from 'react-router';
import styles from './Header.scss';
import ModalWrapper from '../modal';
import classnames from 'classnames';
import Signup from '../../auth/signup';
import Signin from '../../auth/signin';

/**
 * Header Component
 */
class Header extends Component {
    static propTypes = {
        authenticated: PropTypes.bool,
        role: PropTypes.string,
        name: PropTypes.string,
        activeModal: PropTypes.string
    }

    constructor(props) {
        super(props);

        this.state = {
            modalIsOpen: false,
            activeModal: 'signin'
        };
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.changeModalComponent = this.changeModalComponent.bind(this);
    }

    openModal() {
        this.setState({modalIsOpen: true});
    }

    closeModal() {
        this.setState({modalIsOpen: false});
    }

    /**
     * Changes state for modal component and opens modal
     * 
     * @param {String} modalName 
     */
    changeModalComponent(modalName) {
        this.setState({activeModal: modalName === 'signup' ? 'signup' : 'signin'});
        this.openModal();
    }

    /**
     * Renders auth links. If authenticated then signout link
     * else signin and signup
     * 
     * @returns {Component} Link 
     */
    renderAuthLinks() {
        if (this.props.authenticated) {
            let links = [
                <Link to="/profile" key="profile" activeClassName={styles.active} className={styles.link}>Profile</Link>,
                <Link to="/signout" key="signout" activeClassName={styles.active} className={styles.link}>Sign out</Link>
            ];

            if(this.props.role && this.props.role === 'admin') {
                links.unshift(<Link to="/admin" key="admin" activeClassName={styles.active} className={styles.link}>Admin</Link>);
            }

            return links;
        } else {
            return [
                <Link role="button" key="signin" className={styles.link} onClick={() => this.changeModalComponent('signin')}>Sign in</Link>,
                <Link role="button" key="signup" className={styles.link} onClick={() => this.changeModalComponent('signup')}>Sign up</Link>
            ];
        }
    }

    render() {
        return (
            <div className={styles.background}>
                <div className={styles.container}>
                    <nav className={styles.navUpper}>
                        <div>
                            <IndexLink
                                to="/"
                                activeClassName={styles.active}
                                className={classnames(styles.home_link, styles.link)}>Home</IndexLink>
                        </div>
                        <div className={styles.links_right}>
                            {this.renderAuthLinks()}
                        </div>
                    </nav>
                    <h1 className={styles.banner}>{this.props.name}</h1>
                </div>

                <ModalWrapper
                    isOpen={this.state.modalIsOpen}
                    onRequestClose={this.closeModal}
                    contentLabel={this.state.activeModal}>
                    {this.state.activeModal === 'signin' ? <Signin /> : <Signup />}
                </ModalWrapper>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const {authenticated, role} = state.auth;
    let newStateToProps = {
        authenticated
    };

    if (role) {
        newStateToProps.role = role;
    }

    return newStateToProps;
}

export default connect(mapStateToProps)(Header);