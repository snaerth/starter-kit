import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

class Profile extends Component {
    static propTypes = {
        user: PropTypes.object,
        imageUrl: PropTypes.string,
        name: PropTypes.string
        
    }

    render() {
        const {imageUrl, name} = this.props.user;
        return (
            <div>
                <h2>{name}</h2>
                <img src={`/image/${imageUrl}`} alt={name}/>
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
    return { user: state.auth.user};
}

export default connect(mapStateToProps)(Profile);