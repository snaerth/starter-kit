import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';
import styles from './profile.scss';
import CircleImage from '../../components/common/circleImage';
import ModalWrapper from '../../components/common/modal';
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
        this.openModal = this.openModal.bind(this);
        this.afterOpenModal = this.afterOpenModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    componentDidMount() {
        const c = this.refs.imageCanvas;
        const ctx = c.getContext('2d');
        let image = new Image();
        image.src = 'http://localhost:3000/images/users/11870894_10200772623674985_6112941039389153046_n-thumbnail.jpg';
                
        image.onload = () => {
            const aspectRatio = image.width/image.height;
            ctx.filter = 'blur(50px)';
            ctx.drawImage(image, 0, 0, 256, 256  * aspectRatio);
        };
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
        const name = 'Snær Seljan Þóroddsson';
        const imageUrl = '11870894_10200772623674985_6112941039389153046_n.jpg';
        //const { name, imageUrl } = this.props.user;

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
                        <canvas id="canvas" ref='imageCanvas'></canvas>
                    </div>
                </div>

                <button onClick={this.renderCanvas}>Canvas</button>

                <ModalWrapper
                    isOpen={this.state.modalIsOpen}
                    onAfterOpen={this.afterOpenModal}
                    onRequestClose={this.closeModal}
                    contentLabel="Image Modal">
                    <img src={`images/users/${imageUrl}`} alt={name} />
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