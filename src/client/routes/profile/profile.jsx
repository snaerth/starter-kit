import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import styles from './profile.scss';
import CircleImage from '../../components/common/circleImage';
import ModalWrapper from '../../components/common/modal';
import ImageBlurWrapper from '../../components/common/imageBlurWrapper';
import classnames from 'classnames';

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
        this.openModal = this
            .openModal
            .bind(this);
        this.closeModal = this
            .closeModal
            .bind(this);
    }

    openModal() {
        this.setState({ modalIsOpen: true });
    }

    closeModal() {
        this.setState({ modalIsOpen: false });
    }

    render() {
        const { name, imageUrl, thumbnailUrl, email } = this.props.user;
        // const name = 'Snær Seljan Þóroddsson';
        // const imageUrl = '11870894_10200772623674985_6112941039389153046_n.jpg';
        // const thumbnailUrl = '11870894_10200772623674985_6112941039389153046_n-thumbnail.jpg';
        // const email = 'snaerth@gmail.com';
        return (
            <div className="container">
                <div className={styles.grid}>
                    <div className={classnames(styles.card, styles.cardLeft)}>
                        <CircleImage
                            src={`images/users/${imageUrl}`}
                            alt={name}
                            className={styles.profileImage}
                            onClick={this.openModal} />
                        <p className={styles.name}>{name}</p>
                        <a
                            href={`mailto${email}`}
                            title={`Send mail to ${email}`}
                            className="link-slideright">{email}</a>
                    </div>
                    <div className={styles.card}>
                        <h2 className={styles.noMarginTop}>Additonal information</h2>
                    </div>
                </div>

                <ModalWrapper
                    isOpen={this.state.modalIsOpen}
                    onRequestClose={this.closeModal}
                    contentLabel="Image Modal">
                    <ImageBlurWrapper
                        id="1"
                        src={`images/users/${imageUrl}`}
                        thumbnail={`images/users/${thumbnailUrl}`}
                        alt={name} />
                </ModalWrapper>
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