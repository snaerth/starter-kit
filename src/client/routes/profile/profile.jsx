import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import styles from './profile.scss';
import CircleImage from '../../components/common/circleImage';
import classnames from 'classnames';
import Modal from 'react-modal';

const ModalStyles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(55, 58, 71, 0.9)',
        webkitTransitionDuration: '0.5s',
        transitionDuration: '0.5s',
        webkitTransition: 'opacity 0.3s',
        transition: 'opacity 0.3s',
        webkitBackfaceVisibility: 'hidden'
    },
    content: {
        position: 'absolute',
        top: '40px',
        left: '40px',
        right: '40px',
        bottom: '40px',
        border: '1px solid #ccc',
        background: '#fff',
        overflow: 'auto',
        WebkitOverflowScrolling: 'touch',
        borderRadius: '4px',
        outline: 'none',
        padding: '20px'

    }
};


class Profile extends Component {
    static propTypes = {
        user: PropTypes.object,
        imageUrl: PropTypes.string,
        name: PropTypes.string
    }

    constructor(props) {
        super(props);

        this.state = {
            modalIsOpen: false
        };
        this.openModal = this.openModal.bind(this);
        this.afterOpenModal = this.afterOpenModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    openModal() {
        this.setState({ modalIsOpen: true });
    }

    afterOpenModal() {
        console.log('Modal has opened');
    }

    closeModal() {
        this.setState({ modalIsOpen: false });
    }

    render() {
        const { name, imageUrl } = this.props.user;
        return (
            <div className="container">
                <div className={styles.grid}>
                    <div className={classnames(styles.card, styles.cardLeft)}>
                        <CircleImage src={`images/users/${imageUrl}`} alt={name} className={styles.profileImage} onClick={this.openModal} />
                        <p className={styles.name}>{name}</p>
                        <a href="mailto:snaerth@gmail.com" title="Send email to snaerth@gmail.com" className="link-slideright">snaerth@gmail.com</a>
                    </div>
                    <div className={styles.card}>
                        <h2 className={styles.noMarginTop}>Extra information</h2>
                    </div>
                </div>

                <Modal
                    isOpen={this.state.modalIsOpen}
                    onAfterOpen={this.afterOpenModal}
                    onRequestClose={this.closeModal}
                    style={ModalStyles}
                    contentLabel="Image Modal">
                    <img src={`images/users/${imageUrl}`} alt={name} />
                </Modal>
            </div>
        );
    }
}

/**
 * Maps state to components props
 *
 * @param {Object} state - Application state
 * @returns {Object}
 * @author Snær Seljan Þóroddsson
 */
function mapStateToProps(state) {
    return { user: state.auth.user };
}

export default connect(mapStateToProps)(Profile);