import React, {Component} from 'react';
import styles from './HomePage.scss';
import fetch from 'isomorphic-fetch';

class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        };
    }

    componentWillMount() {
        fetch('//offline-news-api.herokuapp.com/stories').then(response => {
            if (response.status >= 400) {
                throw new Error("Bad response from server");
            }
            return response.json();
        }).then(stories => {
            this.setState({data: stories});
            console.log(stories);
        });
    }

    render() {
        return (
            <div>
                <h1 className={styles.headingYellow}>ICELANDIC MOVIE API</h1>

                <ul>
                    {this.state.data.map((item) => {
                            return <li key={item.guid}>{item.author}</li>;
                        })}
                </ul>
            </div>
        );
    }
}

export default HomePage;