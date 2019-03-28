import React from 'react';
import Main from './Main';

class App extends React.Component {
  state = {
    meteorites: [],
    activeLoader: false
  }

  componentDidMount() {
    this.reloadData();
  }

  reloadData = async () => {
    try {
      this.setState({ activeLoader: true });
      const data = await fetch('https://meteor-explorer.herokuapp.com/get').then(data => data.json());
      this.setState({ meteorites: data.data, activeLoader: false });
      console.log("Meteorites fetched...", this.state.meteorites.length);
    } catch (error) {
      console.error("Error: " + error);
    }
  }

  render() {
    return <Main data={this.state.meteorites} reloadData={this.reloadData} activeLoader={this.state.activeLoader} />;
  }
}

export default App;