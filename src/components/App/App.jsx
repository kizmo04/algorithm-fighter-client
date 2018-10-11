import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import "./App.scss";
import Nav from "../Nav/Nav";
import Main from '../Main/Main';
import Modal from '../Modal/Modal';

// import io from 'socket.io-client';
// const socket = io('http://localhost:5000');



class App extends Component {

  componentDidUpdate() {

    // socket.emit('find user', '');
    // socket.emit('disconnecting', 'bye');
    // socket.on('request user info', id => {
    //   console.log('in request user info')
    //   if (Object.keys(this.props.user).length) {
    //     socket.emit('response user info', this.props.user);
    //   }
    // });

    // socket.on('io broadcast', () => {
      // console.log('io broadcast');
    // });

  }

  render() {
    const { token, authenticateUser, logoutUser, isAuthModalActive, handleActivateAuthModal, handleDeactivateAuthModal, findingMatch, user } = this.props;
    const { profileImageUrl } = this.props.user;
    return (
      <div className="App">
        <Nav imageUrl={profileImageUrl} token={token} onLoginButtonClick={handleActivateAuthModal} onLogoutButtonClick={logoutUser}/>
        <Switch>
          <Route exact path="/" render={() => <Main user={user} onBattleButtonClick={findingMatch} />}/>
        </Switch>
        {
          !token && isAuthModalActive ?
          <Modal isActive={isAuthModalActive} onCloseButtonClick={handleDeactivateAuthModal} onGitHubLoginButtonClick={authenticateUser} />
          : null
        }
      </div>
    );
  }
}

export default App;
