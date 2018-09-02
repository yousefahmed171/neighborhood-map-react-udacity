import React, { Component } from 'react';
import PlacesList from "./PlacesList";
import Data from "./Data";
import Map from "./Map";
import './App.css';

class App extends Component {

  constructor(props) {
    super(props)
    this.updateQuery = this.updateQuery.bind(this)
    this.selectFoods = this.selectFoods.bind(this)
  }

  state = {
    foods: [],
    filteredFoods: [],
    selected: null
  };

  componentDidMount() {
    this.setState({ foods: Data.foods, filteredFoods: Data.foods })
  }

  updateQuery(query) {
    this.setState({
      filteredFoods: this.state.foods.filter(food => food.name.toLowerCase().indexOf(query.trim().toLowerCase()) !== -1)
    })
  }

  selectFoods = function (food) {
    this.setState({ selected: food })
  }

  render() {
    return (
      <div className="App">

        <PlacesList
          filter={this.updateQuery}
          selectFoods={this.selectFoods}
          selected={this.state.selected}
          filteredFoods={this.state.filteredFoods}
        />

        <Map
          filteredFoods={this.state.filteredFoods}
          selectFoods={this.selectFoods}
          selected={this.state.selected}
        />

      </div>
    );
  }
}

export default App;