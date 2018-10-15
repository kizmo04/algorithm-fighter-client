import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import "./App.scss";
import Nav from "../Nav/Nav";
import Main from '../Main/Main';
import Modal from '../Modal/Modal';
import {
  APP_STAGE_FIND_MATCH_PARTNER,
  APP_STAGE_PENDING_MATCH_ACCEPTANCE,
  APP_STAGE_ACCEPT_MATCH_INVITATION,
  APP_STAGE_RECEIVING_MATCH_INVITATION,
  APP_STAGE_MATCH_PARTNER_REFUSE_MATCH_INVITATION,
  APP_STAGE_MATCH_PARTNER_UNAVAILABLE,
  APP_STAGE_REFUSE_MATCH_INVITATION,
} from '../../constants/modalTypes';
import {
  AUTH,
  MATCH,
} from '../../constants/modalTypes';

class App extends Component {

  componentDidUpdate(prevProps) {
    const { token, user, appStage, combatRoomKey, emitUserLoginEvent, emitUserLogoutEvent, subscribePendingMatchAcceptanceEvent, subscribeMatchPartnerRefuseMatchInvitationEvent, subscribeMatchPartnerUnavailableEvent, emitRefuseMatchInvitationEvent, emitAcceptMatchInvitationEvent, subscribeSendMatchInvitationEvent, emitFindMatchPartnerEvent, emitFindMatchPartnerEndEvent, unsubscribeMatchPartnerRefuseMatchInvitationEvent, unsubscribeSendMatchInvitationEvent, unsubscribePendingMatchAcceptanceEvent, unsubscribeMatchPartnerUnavailableEvent } = this.props;
    if (!prevProps.token && prevProps.token !== token) {
      emitUserLoginEvent(user);
      subscribeSendMatchInvitationEvent();
    } else if (prevProps.token && !token) {
      emitUserLogoutEvent();
      unsubscribeSendMatchInvitationEvent();
    } else if (prevProps.appStage !== appStage && appStage === APP_STAGE_FIND_MATCH_PARTNER) {
      emitFindMatchPartnerEvent(user, combatRoomKey);
      subscribePendingMatchAcceptanceEvent();
      subscribeMatchPartnerUnavailableEvent();
      unsubscribeSendMatchInvitationEvent();
    } else if (prevProps.appStage !== appStage && appStage === APP_STAGE_PENDING_MATCH_ACCEPTANCE) {
      unsubscribePendingMatchAcceptanceEvent();
      subscribeMatchPartnerRefuseMatchInvitationEvent();
      unsubscribeMatchPartnerUnavailableEvent();
      //subscribe match partner entered
    } else if (prevProps.appStage !== appStage && appStage === APP_STAGE_RECEIVING_MATCH_INVITATION) {
      unsubscribeSendMatchInvitationEvent();

    } else if (prevProps.appStage !== appStage && appStage === APP_STAGE_MATCH_PARTNER_REFUSE_MATCH_INVITATION) {
      unsubscribeMatchPartnerRefuseMatchInvitationEvent();
      subscribeSendMatchInvitationEvent();
      emitFindMatchPartnerEndEvent(combatRoomKey);
    } else if (prevProps.appStage !== appStage && appStage === APP_STAGE_MATCH_PARTNER_UNAVAILABLE) {
      unsubscribeMatchPartnerUnavailableEvent();
      unsubscribePendingMatchAcceptanceEvent();
      subscribeSendMatchInvitationEvent();
      emitFindMatchPartnerEndEvent(combatRoomKey);

    } else if (prevProps.appStage !== appStage && appStage === APP_STAGE_REFUSE_MATCH_INVITATION) {
      emitRefuseMatchInvitationEvent(combatRoomKey, user);
      subscribeSendMatchInvitationEvent();
    } else if (prevProps.appStage !== appStage && appStage === APP_STAGE_ACCEPT_MATCH_INVITATION) {
      emitAcceptMatchInvitationEvent(combatRoomKey, user);
    }

  }

  render() {
    const { token, authenticateUser, logoutUser, isModalActive, modalType, modalMessage, openModal, closeModal, user, appStage, matchPartner, combatRoomKey, acceptMatchInvitation, refuseMatchInvitation } = this.props;
    const { profileImageUrl } = this.props.user;
    return (
      <div className="App">
        <Nav imageUrl={profileImageUrl} token={token} onLoginButtonClick={openModal.bind(null, AUTH, token)} onLogoutButtonClick={logoutUser}/>
        <Switch>
          <Route exact path="/" render={() => <Main user={user} onBattleButtonClick={openModal.bind(null, MATCH, token)} />}/>
        </Switch>
        {
          isModalActive ?
          <Modal user={user} onRetryButtonClick={openModal.bind(null, MATCH, token)} combatRoomKey={combatRoomKey} onCancelButtonClick={refuseMatchInvitation} onAcceptButtonClick={acceptMatchInvitation} isActive={isModalActive} modalMessage={modalMessage} matchPartner={matchPartner} appStage={appStage} modalType={modalType} onCloseButtonClick={closeModal} onGitHubLoginButtonClick={authenticateUser} />
          : null
        }
      </div>
    );
  }
}

export default App;
