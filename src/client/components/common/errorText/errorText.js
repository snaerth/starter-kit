import React from 'react';
import PropTypes from 'prop-types';
import styles from './errorText.scss';
import CSSTransitionGroup from 'react-transition-group';

const ErrorText = ({ error, id }) => {
	return (
		<CSSTransitionGroup
			transitionName="fadeIn"
			transitionEnterTimeout={700}
			transitionLeaveTimeout={700}
		>
			<div key={id} className={styles.error} role="alert" aria-describedby={id}>
				{error}
			</div>
		</CSSTransitionGroup>
	);
};

ErrorText.propTypes = {
	id: PropTypes.string,
	error: PropTypes.string
};

export default ErrorText;
