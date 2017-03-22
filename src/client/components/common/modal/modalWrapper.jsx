import React, { Component, PropTypes } from 'react';
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
}

export default ModalWrapper;