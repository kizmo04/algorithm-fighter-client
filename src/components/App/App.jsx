import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import "./App.scss";
import Nav from "../Nav/Nav";
import Main from '../Main/Main';
import Modal from '../Modal/Modal';


// import io from 'socket.io-client';
// const socket = io('http://localhost:5000');



class App extends Component {

  componentDidMount() {
    this.props.handleGotInvitationEvent();
  }

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
    const { token, authenticateUser, logoutUser, isModalActive, modalType, modalMessage, handleOpenAuthModal, handleCloseModal, findingMatchOrLogin, user, matchingStage, matchingUser, handleSendAcceptMessageEvent, combatRoomKey } = this.props;
    const { profileImageUrl } = this.props.user;
    return (
      <div className="App">
        <Nav imageUrl={profileImageUrl} token={token} onLoginButtonClick={handleOpenAuthModal} onLogoutButtonClick={logoutUser}/>
        <Switch>
          <Route exact path="/" render={() => <Main user={user} onBattleButtonClick={findingMatchOrLogin} />}/>
        </Switch>
        {
          isModalActive ?
          <Modal combatRoomKey={combatRoomKey} onAcceptButtonClick={handleSendAcceptMessageEvent} isActive={isModalActive} modalMessage={modalMessage} matchingUser={matchingUser} matchingStage={matchingStage} modalType={modalType} onCloseButtonClick={handleCloseModal} onGitHubLoginButtonClick={authenticateUser} />
          : null
        }
      </div>
    );
  }
}

export default App;
