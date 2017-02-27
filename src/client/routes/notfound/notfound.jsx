import React, {Component} from 'react';
import {Link} from 'react-router';

/**
 * Not Found component
 */
export default class NotFound extends Component {
    /**
   * Render method
   * @return {Component}
   */
    render() {
        return (
            <div className="not-found">
                <h1>404</h1>
                <h2>Page not found!</h2>
                <p>
                    <Link to="/">Go back to the main page</Link>
                </p>
            </div>
        );
    }
}