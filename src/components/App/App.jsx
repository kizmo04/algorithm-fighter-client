import React, { Component } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import "./App.scss";
import Nav from "../Nav/Nav";
import Main from '../Main/Main';
import Auth from '../Auth/Auth';

class App extends Component {

  render() {
    const { token, authenticateUser } = this.props;
    return (
      <div className="App">
        <Nav />
        <Switch>
          <Route exact path="/" component={Main}/>
          <Route path="/signup" render={() => {
            if (!token) {
              return <Auth authenticateUser={authenticateUser} />;
            } else {
              return <Redirect to="/" />;
            }
          }} />

        </Switch>
      </div>
    );
  }
}

export default App;
