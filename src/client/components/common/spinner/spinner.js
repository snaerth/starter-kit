import React, { PropTypes } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import styles from './spinner.scss';

/**
 * Signup component
 */
const Spinner = props => {
    return (
        <ReactCSSTransitionGroup
            component="div"
            transitionName="fadeInScale"
            transitionEnterTimeout={700}
            transitionLeaveTimeout={350}>
            <div className={styles.spinner}>
                <svg className={styles.ball}>
                    <circle cx="10" cy="10" r="10"/>
                </svg>
                <p className={styles.text}>{props.children}</p>
            </div>
        </ReactCSSTransitionGroup>
    );
};

Spinner.propTypes = {
    children: PropTypes.string
};

export default Spinner;