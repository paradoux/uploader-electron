import React, { Component } from 'react';

import './App.css';

import DropZone from './containers/DropZone';

class App extends Component {
  render() {
    return (
      <div className="App">
        <DropZone />
      </div>
    );
  }
}

export default App;
