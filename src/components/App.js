import React from 'react';
import Main from './Main';

class App extends React.Component {
  state = {
    meteorites: []
  }

  componentDidMount() {
    this.reloadData();
  }

  reloadData = async () => {
    try {
      const data = await fetch('https://meteor-explorer.herokuapp.com/get').then(data => data.json());
      this.setState({ meteorites: data.data });
      console.log("Meteorites fetched...", this.state.meteorites.length);
    } catch (error) {
      console.error("Error: " + error);
    }
  }

  render() {
    return <Main data={this.state.meteorites} reloadData={this.reloadData} />;
  }
}

export default App;