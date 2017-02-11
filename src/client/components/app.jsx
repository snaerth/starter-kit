import React, { Component, PropTypes } from 'react';
import AppLayout from './app-layout';
import Header from './common/header/Header.jsx';

class App extends Component {
  render() {
    return (
        <AppLayout>
            <Header />
            {this.props.children}
        </AppLayout>
      );
  }
}

App.propTypes = {
  children: PropTypes.object.isRequired,
};

export default App;