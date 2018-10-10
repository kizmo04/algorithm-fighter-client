import React, { Component } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import "./App.scss";
import Nav from "../Nav/Nav";
import Main from '../Main/Main';
import Auth from '../Auth/Auth';

class App extends Component {

  render() {
    const { token, authenticateUser, logoutUser, isAuthModalActive, handleActivateAuthModal, handleDeactivateAuthModal } = this.props;
    return (
      <div className="App">
        <Nav token={token} onLoginButtonClick={handleActivateAuthModal} onLogoutButtonClick={logoutUser}/>
        <Switch>
          <Route exact path="/" render={() => <Main />}/>
        </Switch>
        {
          !token && isAuthModalActive ?
          <Auth isActive={isAuthModalActive} onCloseButtonClick={handleDeactivateAuthModal} onGitHubLoginButtonClick={authenticateUser} />
          : null
        }
      </div>
    );
  }
}

export default App;
