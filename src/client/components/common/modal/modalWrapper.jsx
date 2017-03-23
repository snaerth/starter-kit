import React, { PropTypes } from 'react';
import Modal from 'react-modal';
import styles from './modalWrapper.scss';
import ExitIcon from '../../../common/svg/exit.svg';

const ModalStyles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(55, 58, 71, 0.9)',
        WebkitTransitionDuration: '0.5s',
        transitionDuration: '0.5s',
        WebkitTransition: 'opacity 0.3s',
        transition: 'opacity 0.3s',
        WebkitBackfaceVisibility: 'hidden'
    },
    content: {
        overflow: 'auto',
        WebkitOverflowScrolling: 'touch',
        borderRadius: '2px',
        border: 'none',
        outline: 'none',
        padding: '45px 20px 20px',
        position: 'fixed',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: 'auto',
        top: '50%',
        left: '50%',
        bottom: 'initial',
        right: 'initial',
        maxWidth: '960px',
        minWidth: '320px',
        WebkitBackfaceVisibility: 'hidden',
        MozBackfaceVisibility: 'hidden',
        backfaceVisibility: 'hidden',
        WebkitTransform: 'translateX(-50%) translateY(-50%)',
        MozTransform: 'translateX(-50%) translateY(-50%)',
        MsTransform: 'translateX(-50 %) translateY(-50 %)',
        transform: 'translateX(-50%) translateY(-50%)'
    }
};

/**
 * Modal component
 */
const ModalWrapper = (props) => {
    return (
        <Modal
            {...props}
            style={ModalStyles}>
            <div>
                <ExitIcon className={styles.exit} onClick={props.onRequestClose}/>
                {props.children}
            </div>
        </Modal>
    );
};

ModalWrapper.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onAfterOpen: PropTypes.func,
    onRequestClose: PropTypes.func.isRequired,
    contentLabel: PropTypes.string.isRequired,
    children: PropTypes.element
};

export default ModalWrapper;