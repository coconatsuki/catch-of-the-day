import React from "react";
import PropTypes from "prop-types";
import Header from "./Header";
import Order from "./Order";
import Inventory from "./Inventory";
import SampleFishes from "../sample-fishes";
import Fish from "./Fish";
import base from "../base";

class App extends React.Component {
  state = {
    fishes: {},
    order: {}
  };

  static propTypes = {
    match: PropTypes.object
  };

  componentDidMount() {
    // We only want the database of OUR STORE (Our App instance) => SO we fetch the name of the store from App props
    // To create a hierarchy in firebase, we give it the store name, and we nest the fishes inside, adding them after a slash /
    const { params } = this.props.match;
    const localStorageRef = localStorage.getItem(params.storeId);
    if (localStorageRef) {
      this.setState({ order: JSON.parse(localStorageRef) });
    }
    this.ref = base.syncState(`${params.storeId}/fishes`, {
      // ref = reference to a piece of data we want to mirror
      context: this,
      state: "fishes" // Object to be synchronized
    });
  }

  componentWillUnmount() {
    // Used to clean the store (this App instance), to avoid a memory lick. When we leave, we remove the store from firebase.
    base.removeBinding(this.ref);
  }

  componentDidUpdate() {
    localStorage.setItem(
      this.props.match.params.storeId,
      JSON.stringify(this.state.order)
    );
  }

  addFish = fish => {
    // 1. Take a copy of the existing state
    const fishes = { ...this.state.fishes };
    // 2. Add our new fish to that fishes variable
    fishes[`fish${Date.now()}`] = fish;
    // 3. Set the new fishes object to state
    this.setState({ fishes });
  };

  updateFish = (key, updatedFish) => {
    // 1. Take a copy of the current state
    const fishes = { ...this.state.fishes };
    // 2. Using this copy, we update the fish we want:
    fishes[key] = updatedFish;
    // 3. Set that to state (fishes: fishes)
    this.setState({ fishes });
  };

  deleteFish = key => {
    // 1. Take a copy of state
    const fishes = { ...this.state.fishes };
    // 2. update the state with the fish we want to delete.
    // We cannot use "delete fishes.fish1" because of firebase,
    //that needs to receive a null for deleting a key/value.
    fishes[key] = null;
    this.setState({ fishes });
  };

  loadSampleFishes = () => {
    this.setState({ fishes: SampleFishes });
  };

  addToOrder = key => {
    // 1. Take a copy of state
    const order = { ...this.state.order };
    // 2. Either add to the order, or update the number in our order
    order[key] = order[key] + 1 || 1;
    // 3. Call setState to update our state object
    this.setState({ order });
  };

  removeFromOrder = key => {
    // 1. Take a copy of state
    const order = { ...this.state.order };
    // 2. Delete the order ("delete" works with Local Storage, unlike with Firebase)
    delete order[key];
    // 3. update State
    this.setState({ order });
  };

  render() {
    return (
      <div className="catch-of-the-day">
        <div className="menu">
          <Header tagline="Fresh Seafood Market" />
          <ul className="fishes">
            {Object.keys(this.state.fishes).map(key => (
              <Fish
                key={key}
                index={key}
                details={this.state.fishes[key]}
                addToOrder={this.addToOrder}
              />
            ))}
          </ul>
        </div>
        <Order
          fishes={this.state.fishes}
          order={this.state.order}
          removeFromOrder={this.removeFromOrder}
        />
        <Inventory
          addFish={this.addFish}
          updateFish={this.updateFish}
          deleteFish={this.deleteFish}
          loadSampleFishes={this.loadSampleFishes}
          fishes={this.state.fishes}
          storeId={this.props.match.params.storeId}
        />
      </div>
    );
  }
}

export default App;
