import React, { PropTypes } from 'react';
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
        overflow: 'auto',
        WebkitOverflowScrolling: 'touch',
        borderRadius: '2px',
        border: 'none',
        outline: 'none',
        padding: '1em',
        position: 'fixed',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        width: '50%',
        height: 'auto',
        top: '50%',
        left: '50%',
        bottom: 'initial',
        right: 'initial',
        maxWidth: '960px',
        minWidth: '320px',
        webkitBackfaceVisibility: 'hidden',
        mozBackfaceVisibility: 'hidden',
        backfaceVisibility: 'hidden',
        webkitTransform: 'translateX(-50%) translateY(-50%)',
        mozTransform: 'translateX(-50%) translateY(-50%)',
        msTransform: 'translateX(-50 %) translateY(-50 %)',
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
            {props.children}
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