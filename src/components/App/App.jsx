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
  APP_STAGE_MATCH_STARTED,
  APP_STAGE_MATCH_END,
} from '../../constants/modalTypes';
import {
  AUTH,
  MATCH,
} from '../../constants/modalTypes';
import _ from 'lodash';
import UserDetail from "../UserDetail/UserDetail";

class App extends Component {
  componentDidMount() {
    this.props.checkUserAuth();
  }

  componentDidUpdate(prevProps) {
    const { token, user, matchPartner, problem, isFetching, appStage, combatRoomKey, matchId, emitUserLoginEvent, emitUserLogoutEvent, subscribePendingMatchAcceptanceEvent, subscribeMatchPartnerRefuseMatchInvitationEvent, subscribeMatchPartnerUnavailableEvent, emitRefuseMatchInvitationEvent, emitAcceptMatchInvitationEvent, subscribeSendMatchInvitationEvent, emitFindMatchPartnerEvent, emitFindMatchPartnerEndEvent, unsubscribeMatchPartnerRefuseMatchInvitationEvent, unsubscribeSendMatchInvitationEvent, unsubscribePendingMatchAcceptanceEvent, unsubscribeMatchPartnerUnavailableEvent, fetchRandomProblem, emitSendRandomProblemEvent, subscribeMatchStartEvent, subscribeMatchPartnerEnteredEvent, subscribeMatchPartnerKeyDownEvent, subscribeMatchPartnerKeyUpEvent, subscribeMatchPartnerSolutionSubmittedEvent, subscribeMatchTimerEvent } = this.props;

    if (!prevProps.token && prevProps.token !== token) {
      emitUserLoginEvent(user);
      subscribeSendMatchInvitationEvent();
    } else if (prevProps.token && !token) {
      emitUserLogoutEvent();
      unsubscribeSendMatchInvitationEvent();
    }

    switch(appStage) {
      case APP_STAGE_FIND_MATCH_PARTNER:
        emitFindMatchPartnerEvent(user, combatRoomKey);
        subscribePendingMatchAcceptanceEvent();
        subscribeMatchPartnerUnavailableEvent();
        unsubscribeSendMatchInvitationEvent();
        break;
      case APP_STAGE_PENDING_MATCH_ACCEPTANCE:
        unsubscribePendingMatchAcceptanceEvent();
        subscribeMatchPartnerRefuseMatchInvitationEvent();
        unsubscribeMatchPartnerUnavailableEvent();
        subscribeMatchPartnerEnteredEvent();
        break;
      case APP_STAGE_RECEIVING_MATCH_INVITATION:
        unsubscribeSendMatchInvitationEvent();
        break;
      case APP_STAGE_MATCH_PARTNER_REFUSE_MATCH_INVITATION:
        unsubscribeMatchPartnerRefuseMatchInvitationEvent();
        subscribeSendMatchInvitationEvent();
        break;
      case APP_STAGE_MATCH_PARTNER_UNAVAILABLE:
        unsubscribeMatchPartnerUnavailableEvent();
        unsubscribePendingMatchAcceptanceEvent();
        subscribeSendMatchInvitationEvent();
        emitFindMatchPartnerEndEvent(combatRoomKey);
        break;
      case APP_STAGE_REFUSE_MATCH_INVITATION:
        emitRefuseMatchInvitationEvent(combatRoomKey, user);
        subscribeSendMatchInvitationEvent();
        break;
      case APP_STAGE_ACCEPT_MATCH_INVITATION:
        emitAcceptMatchInvitationEvent(combatRoomKey, user);
        subscribeMatchStartEvent();
        break;
      case APP_STAGE_MATCH_PREPARATION:
        fetchRandomProblem(user._id, matchPartner._id, combatRoomKey, token);
        break;
      case APP_STAGE_MATCH_PROBLEM_FETCHED:
        subscribeMatchStartEvent();
        break;
      case APP_STAGE_MATCH_STARTED:
        subscribeMatchPartnerKeyDownEvent();
        subscribeMatchPartnerKeyUpEvent();
        subscribeMatchPartnerSolutionSubmittedEvent();
        subscribeMatchTimerEvent();
        break;
      case APP_STAGE_MATCH_END:
      default:
        break;
    }
  }

  render() {
    const { token, isFetching, expandedAccordionIndex, expandAccordion, authenticateUser, logoutUser, solutionList, matchResultList, isModalActive, modalType, modalMessage, openModal, closeModal, user, appStage, matchPartner, combatRoomKey, acceptMatchInvitation, refuseMatchInvitation, isMatchStarted, matchId, problem, isMatchPartnerKeyPress, matchMessage, initMatchPartnerKeyPress, emitKeyDownEvent, emitKeyUpEvent, testResult, countPassed, isPassedAll, matchPartnerTestResult, matchPartnerCountPassed, matchPartnerIsPassedAll, submitSolution, changeCode, code, matchTime, fetchUserPastMatchResult, fetchUserPastSolutions, collapseAccordion, updateMatchResult, matchResult } = this.props;
    const matchModalProps = {
      user,
      isFetching,
      appStage,
      modalMessage,
      matchResult,
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
    const matchPartnerProps = {
      matchPartner,
      matchPartnerTestResult,
      matchPartnerCountPassed,
      matchPartnerIsPassedAll,
      isMatchPartnerKeyPress,
    };

    const userProps = {
      user,
      testResult,
      countPassed,
      isPassedAll,
    };
    return (
      <div className="App">
        <Nav user={user} token={token} onLoginButtonClick={openModal.bind(null, AUTH, token)} onLogoutButtonClick={logoutUser}/>
        <Switch>
          <Route exact path="/" render={() => <Main user={user} onBattleButtonClick={openModal.bind(null, MATCH, token)} />}/>
          <Route path="/matches/:match_id" render={({ match }) => {
            if (token) {
              return (
                <CombatMatch matchId={match.params.match_id} onDidUpdate={updateMatchResult} isFetching={isFetching} matchTime={matchTime} combatRoomKey={combatRoomKey} code={code} token={token} {...userProps} {...matchPartnerProps} changeCode={changeCode} onSubmitButtonClick={submitSolution} emitKeyDownEvent={_.debounce(emitKeyDownEvent.bind(null, combatRoomKey), 500)} emitKeyUpEvent={_.debounce(emitKeyUpEvent.bind(null, combatRoomKey), 500)} matchMessage={matchMessage} problem={problem} />
                );
              } else {
                return <Redirect to="/" />;
              }
            }}/>
          <Route path="/users/:user_id" render={({ location }) => {
            if (token) {
              return <UserDetail collapseAccordion={collapseAccordion} expandAccordion={expandAccordion} expandedAccordionIndex={expandedAccordionIndex} token={token} solutionList={solutionList} fetchUserPastSolutions={fetchUserPastSolutions} fetchUserPastMatchResult={fetchUserPastMatchResult} matchResultList={matchResultList} pathName={location.pathname} user={user} />;
            } else {
              return <Redirect to="/" />;
            }
          }} />
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
