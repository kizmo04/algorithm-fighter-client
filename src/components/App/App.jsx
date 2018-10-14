import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import "./App.scss";
import Nav from "../Nav/Nav";
import Main from '../Main/Main';
import Modal from '../Modal/Modal';

class App extends Component {
  componentDidMount() {
    this.props.subscribeSendMatchInvitationEvent();
  }

  render() {
    const { token, authenticateUser, logoutUser, isModalActive, modalType, modalMessage, handleOpenAuthModal, handleCloseModal, findingMatchOrLogin, user, matchingStage, matchingUser, combatRoomKey, emitRefuseMatchInvitationEvent, emitAcceptMatchInvitationEvent } = this.props;
    const { profileImageUrl } = this.props.user;
    return (
      <div className="App">
        <Nav imageUrl={profileImageUrl} token={token} onLoginButtonClick={handleOpenAuthModal} onLogoutButtonClick={logoutUser}/>
        <Switch>
          <Route exact path="/" render={() => <Main user={user} onBattleButtonClick={findingMatchOrLogin} />}/>
        </Switch>
        {
          isModalActive ?
          <Modal onRetryButtonClick={findingMatchOrLogin} combatRoomKey={combatRoomKey} onCancelButtonClick={emitRefuseMatchInvitationEvent} onAcceptButtonClick={emitAcceptMatchInvitationEvent} isActive={isModalActive} modalMessage={modalMessage} matchingUser={matchingUser} matchingStage={matchingStage} modalType={modalType} onCloseButtonClick={handleCloseModal} onGitHubLoginButtonClick={authenticateUser} />
          : null
        }
      </div>
    );
  }
}

export default App;
