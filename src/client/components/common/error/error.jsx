import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import styles from './error.scss';
import classnames from 'classnames';
import {TweenMax} from 'gsap';

/**
 * Error component
 */
class Error extends Component {
    componentDidMount() {
        const node = ReactDOM.findDOMNode(this);
        TweenMax.fromTo(node, 0.5, {y: 10}, {y: 0});
    }

    render() {
        const {text, strongText} = this.props;

        return (
            <div className={classnames(styles.error)}>
                <strong>{strongText}</strong>
                {text}
            </div>
        );
    }

}

Error.propTypes = {
    strongText: PropTypes.string,
    text: PropTypes.string
};

export default Error;