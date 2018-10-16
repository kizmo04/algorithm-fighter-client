import React, { Component } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import "./App.scss";
import Nav from "../Nav/Nav";
import Main from '../Main/Main';
import Modal from '../Modal/Modal';
import AuthModal from '../AuthModal/AuthModal';
import MatchModal from '../MatchModal/MatchModal';
import CombatMatch from '../CombatMatch/CombatMatch';
import {
  APP_STAGE_FIND_MATCH_PARTNER,
  APP_STAGE_PENDING_MATCH_ACCEPTANCE,
  APP_STAGE_ACCEPT_MATCH_INVITATION,
  APP_STAGE_RECEIVING_MATCH_INVITATION,
  APP_STAGE_MATCH_PARTNER_REFUSE_MATCH_INVITATION,
  APP_STAGE_MATCH_PARTNER_UNAVAILABLE,
  APP_STAGE_REFUSE_MATCH_INVITATION,
  APP_STAGE_MATCH_PREPARATION,
  APP_STAGE_MATCH_PROBLEM_FETCHED,
} from '../../constants/modalTypes';
import {
  AUTH,
  MATCH,
} from '../../constants/modalTypes';

class App extends Component {

  componentDidUpdate(prevProps) {
    const { token, user, matchPartner, problem, appStage, combatRoomKey, emitUserLoginEvent, emitUserLogoutEvent, subscribePendingMatchAcceptanceEvent, subscribeMatchPartnerRefuseMatchInvitationEvent, subscribeMatchPartnerUnavailableEvent, emitRefuseMatchInvitationEvent, emitAcceptMatchInvitationEvent, subscribeSendMatchInvitationEvent, emitFindMatchPartnerEvent, emitFindMatchPartnerEndEvent, unsubscribeMatchPartnerRefuseMatchInvitationEvent, unsubscribeSendMatchInvitationEvent, unsubscribePendingMatchAcceptanceEvent, unsubscribeMatchPartnerUnavailableEvent, fetchRandomProblem, emitSendRandomProblemEvent, subscribeMatchStartEvent, subscribeMatchPartnerEnteredEvent } = this.props;
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
      subscribeMatchPartnerEnteredEvent();
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
      subscribeMatchStartEvent();
    } else if (prevProps.appStage !== appStage && appStage === APP_STAGE_MATCH_PREPARATION) {
      fetchRandomProblem(user._id, matchPartner._id);
    } else if (prevProps.appStage !== appStage && appStage === APP_STAGE_MATCH_PROBLEM_FETCHED) {
      emitSendRandomProblemEvent(problem, combatRoomKey);
      subscribeMatchStartEvent();
    }
  }

  render() {
    const { token, authenticateUser, logoutUser, isModalActive, modalType, modalMessage, openModal, closeModal, user, appStage, matchPartner, combatRoomKey, acceptMatchInvitation, refuseMatchInvitation, isMatchStarted, matchId, problem } = this.props;
    const { profileImageUrl } = this.props.user;
    const matchModalProps = {
      user,
      appStage,
      modalMessage,
      matchPartner,
      combatRoomKey,
      onAcceptButtonClick: acceptMatchInvitation,
      onCancelButtonClick: refuseMatchInvitation,
      onRetryButtonClick: openModal.bind(null, MATCH, token),
      onCloseButtonClick: closeModal,
    };
    const authModalProps = {
      onGitHubLoginButtonClick: authenticateUser,
      onCloseButtonClick: closeModal,
    };
    return (
      <div className="App">
        <Nav imageUrl={profileImageUrl} token={token} onLoginButtonClick={openModal.bind(null, AUTH, token)} onLogoutButtonClick={logoutUser}/>
        <Switch>
          <Route exact path="/" render={() => <Main user={user} onBattleButtonClick={openModal.bind(null, MATCH, token)} />}/>
          <Route path="/matches/:match_id" render={() => <CombatMatch user={user} matchPartner={matchPartner} problem={problem} />}/>
        </Switch>
        <Modal isActive={isModalActive} onCloseButtonClick={closeModal}>
          {
            modalType === AUTH ? <AuthModal {...authModalProps} /> : <MatchModal {...matchModalProps} />
          }
        </Modal>
        {
          isMatchStarted ? <Redirect to={`/matches/${matchId}`} /> : null
        }
      </div>
    );
  }
}

export default App;
