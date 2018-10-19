import { connect } from 'react-redux';
import AppComponent from '../components/App/App';
import { signIn as signInGitHub, signOut as signOutGitHub } from '../lib/firebase';
import jwt from 'jsonwebtoken';
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import {
  successUserAuthentication,
  userLogout,
  authModalOpen,
  matchModalOpen,
  modalClose,
  pendingMatchAcceptance,
  receivingMatchInvitation,
  matchPartnerRefuseMatchInvitation,
  matchPartnerUnavailable,
  refuseMatchInvitation,
  acceptMatchInvitation,
  matchProblemFetched,
  matchPreparation,
  matchStarted,
  matchPartnerKeyDown,
  matchPartnerKeyUp,
  codeChanged,
  matchPartnerSolutionSubmitted,
  matchTimer,
  requestSolutionSubmit,
  successSolutionSubmit,
  successUserPastMatchResult,
  successUserPastSolutionList,
  accordionExpanded,
  accordionCollapsed,
  successMatchEnd,
  appStageReset,
  matchPartnerMatchGiveUp,
  userGiveUpMatch,
} from '../actions';
import {
  subscribeMatchPartnerGiveUpEvent,
  subscribeMatchPartnerWinningEvent,
  subscribeMatchTimerEvent,
  subscribePendingMatchAcceptanceEvent,
  subscribeSendMatchInvitationEvent,
  subscribeMatchPartnerRefuseMatchInvitationEvent,
  subscribeMatchPartnerUnavailableEvent,
  subscribeMatchPartnerEnteredEvent,
  subscribeMatchStartEvent,
  subscribeMatchPartnerKeyDownEvent,
  subscribeMatchPartnerKeyUpEvent,
  subscribeMatchPartnerSolutionSubmittedEvent,
  unsubscribePendingMatchAcceptanceEvent,
  unsubscribeSendMatchInvitationEvent,
  unsubscribeMatchPartnerRefuseMatchInvitationEvent,
  unsubscribeMatchPartnerUnavailableEvent,
  emitAcceptMatchInvitationEvent,
  emitRefuseMatchInvitationEvent,
  emitFindMatchPartnerEvent,
  emitFindMatchPartnerEndEvent,
  emitUserLoginEvent,
  emitUserLogoutEvent,
  emitSendRandomProblemEvent,
  emitKeyDownEvent,
  emitKeyUpEvent,
  emitSolutionSubmittedEvent,
  emitUserWinningEvent,
  emitUserGiveUpMatchEvent,
  emitUserSocketInitEvent,
} from '../lib/socket';
import { MATCH, APP_STAGE_MATCH_STARTED } from '../constants/modalTypes';
import { config } from '../config';

const { JWT_SECRET } = config;

let ROOT;

if (process.env.NODE_ENV === 'development') {
  ROOT = 'http://api-dev.kizmo04.com';
} else if (process.env.NODE_ENV === 'production') {
  ROOT = 'https://api.kizmo04.com';
}

library.add(fab);

const mapStateToProps = state => Object.assign({}, state);

const mapDispatchToProps = dispatch => {
  return {
    authenticateUser () {
      signInGitHub()
      .then(result => {
        const { email, displayName, photoURL} = result.user;
        const { bio, login } = result.additionalUserInfo.profile;
        fetch(`${ROOT}/api/auth`, {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json; charset=utf-8"
          },
          body: JSON.stringify({
            email,
            name: displayName,
            user_name: login,
            short_bio: bio,
            profile_image_url: photoURL,
          })
        })
        .then(response => {
          const contentType = response.headers.get("content-type");
          if(response.ok && contentType && contentType.includes("application/json")) {
            return response.json();
          }
          throw new Error();
        })
        .then(body => {
          const { token } = body;
          jwt.verify(token, JWT_SECRET, function(err, decoded) {
            if (err) {
              console.log(err);
            }
            const { _id, name, userName, profileImageUrl, email, shortBio, createdAt, solutions } = decoded;
            const user = {
              _id,
              name,
              userName,
              profileImageUrl,
              email,
              shortBio,
              createdAt,
              solutions,
            };
            localStorage.setItem('algorithmFighter', JSON.stringify({ token }));
            dispatch(successUserAuthentication(token, user));
          });
        })
        .catch(err => {
          console.log(err.message);
        });
      })
      .catch(err => {
        console.log(err.message);
      });
    },
    logoutUser() {
      signOutGitHub()
      .then(() => {
        if (localStorage['algorithmFighter']) {
          localStorage['algorithmFighter'].token = '';
        }
        dispatch(userLogout());
      })
      .catch(err => {
        console.log(err);
      })
    },
    async fetchRandomProblem(userId, matchPartnerId, combatRoomKey, token, isHost) {
      let problem, matchId;
      try {
        if (isHost) {
          const responseRandomProblem = await fetch(`${ROOT}/api/problems/random?u_id=${userId}&p_id=${matchPartnerId}`, {
            method: "GET",
            mode: "cors",
            headers: {
              "Pragma": "no-cache",
              "Cache-Control": "no-cache",
              "Content-Type": "application/json; charset=utf-8",
              "Authorization": `Bearer ${token}`
            },
          });
          const bodyRandomProblem = await responseRandomProblem.json();
          problem = bodyRandomProblem.problem;
          const responseNewMatch = await fetch(`${ROOT}/api/matches`, {
            method: "POST",
            mode: "cors",
            headers: {
              "Content-Type": "application/json; charset=utf-8",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
              host_id: userId,
              guest_id: matchPartnerId,
            })
          });
          const bodyNewMatch = await responseNewMatch.json();
          matchId = bodyNewMatch._id;

          dispatch(matchProblemFetched(problem, matchId));
        }
      } catch(err) {
        console.log(err);
      }
    },
    async submitSolution(userId, code, problemId, token, combatRoomKey) {
      try {
        dispatch(requestSolutionSubmit());
        const response = await fetch(`${ROOT}/api/users/${userId}`, {
          method: "PUT",
          body: JSON.stringify({ code, problem_id: problemId }),
          mode: "cors",
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Authorization": `Bearer ${token}`,
          }
        });

        const body = await response.json();
        const { testResult, countPassed, isPassedAll } = body;
        dispatch(successSolutionSubmit(testResult, countPassed, isPassedAll, false));
        emitSolutionSubmittedEvent(testResult, countPassed, isPassedAll, combatRoomKey);
      } catch(err) {
        console.log(err);
      }
    },
    async fetchUserPastMatchResult(userId, token) {
      try {
        const response = await fetch(`${ROOT}/api/users/${userId}/matches`, {
          method: "GET",
          mode: "cors",
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Authorization": `Bearer ${token}`
          }
        });

        const body = await response.json();

        dispatch(successUserPastMatchResult(body));
      } catch (error) {
        console.log(error);
      }
    },
    async fetchUserPastSolutions(userId, token) {
      try {
        const response = await fetch(`${ROOT}/api/users/${userId}/solutions`, {
          method: "GET",
          mode: "cors",
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Authorization": `Bearer ${token}`
          }
        });

        const body = await response.json();

        dispatch(successUserPastSolutionList(body));
      } catch (error) {
        console.log(error);
      }
    },
    async updateMatchResult (token, userId, matchId) {
      try {
        const response = await fetch(`${ROOT}/api/matches/${matchId}`, {
          method: 'PUT',
          mode: 'cors',
          body: JSON.stringify({
            winner_id: userId
          }),
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Authorization": `Bearer ${token}`
          }
        });

        const body = await response.json();

        dispatch(successMatchEnd(body));
      } catch (error) {
      }
    },
    giveUpMatch() {
      dispatch(userGiveUpMatch());
    },
    checkUserAuth() {
      if (localStorage['algorithmFighter']) {
        const token = JSON.parse(localStorage['algorithmFighter']).token;
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
          if (err) {
            console.log(err);
          }
          const { _id, name, userName, profileImageUrl, email, shortBio, createdAt, solutions } = decoded;
          const user = {
            _id,
            name,
            userName,
            profileImageUrl,
            email,
            shortBio,
            createdAt,
            solutions,
          };
          dispatch(successUserAuthentication(token, user));
        });
      }

    },
    expandAccordion(index) {
      dispatch(accordionExpanded(index));
    },
    collapseAccordion(index) {
      dispatch(accordionCollapsed(index));
    },
    changeCode(editor, data, code) {
      dispatch(codeChanged(code));
    },
    closeModal(appStage, token, user, matchResultList, solutionList) {
      dispatch(modalClose());
      if (appStage !== APP_STAGE_MATCH_STARTED) {
        dispatch(appStageReset(appStage, token, user, matchResultList, solutionList));
      }
    },
    openModal(type, token){
      if (type === MATCH && token) {
        dispatch(matchModalOpen());
      } else {
        dispatch(authModalOpen());
      }
    },
    refuseMatchInvitation() {
      dispatch(refuseMatchInvitation());
    },
    acceptMatchInvitation() {
      dispatch(acceptMatchInvitation());
    },
    subscribeMatchTimerEvent() {
      subscribeMatchTimerEvent(time => {
        dispatch(matchTimer(time));
      });
    },
    subscribeMatchPartnerGiveUpEvent() {
      subscribeMatchPartnerGiveUpEvent(() => {
        dispatch(matchPartnerMatchGiveUp());
      });
    },
    subscribeMatchPartnerWinningEvent() {
      subscribeMatchPartnerWinningEvent(matchResult => {
        dispatch(successMatchEnd(matchResult));
      });
    },
    subscribeMatchPartnerSolutionSubmittedEvent() {
      subscribeMatchPartnerSolutionSubmittedEvent((matchPartnerTestResult, matchPartnerCountPassed, matchPartnerIsPassedAll) => {
        dispatch(matchPartnerSolutionSubmitted(matchPartnerTestResult, matchPartnerCountPassed, matchPartnerIsPassedAll));
      });
    },
    subscribeMatchPartnerUnavailableEvent() {
      subscribeMatchPartnerUnavailableEvent(() => {
        dispatch(matchPartnerUnavailable());
      });
    },
    subscribeMatchPartnerRefuseMatchInvitationEvent() {
      subscribeMatchPartnerRefuseMatchInvitationEvent(combatRoomKey => {
        dispatch(matchPartnerRefuseMatchInvitation(combatRoomKey));
      });
    },
    subscribePendingMatchAcceptanceEvent() {
      subscribePendingMatchAcceptanceEvent(matchPartner => {
        dispatch(pendingMatchAcceptance(matchPartner));
      });
    },
    subscribeSendMatchInvitationEvent() {
      subscribeSendMatchInvitationEvent((hostUser, combatRoomKey) => {
        dispatch(receivingMatchInvitation(hostUser, combatRoomKey));
      });
    },
    subscribeMatchPartnerEnteredEvent() {
      subscribeMatchPartnerEnteredEvent((matchPartner, combatRoomKey) => {
        dispatch(matchPreparation(matchPartner, combatRoomKey));
      });
    },
    subscribeMatchStartEvent() {
      subscribeMatchStartEvent((problem, matchId, matchTime) => {
        dispatch(matchStarted(problem, matchId, matchTime));
      });
    },
    subscribeMatchPartnerKeyDownEvent() {
      subscribeMatchPartnerKeyDownEvent(() => {
        dispatch(matchPartnerKeyDown());
      });
    },
    subscribeMatchPartnerKeyUpEvent() {
      subscribeMatchPartnerKeyUpEvent(() => {
        dispatch(matchPartnerKeyUp());
      });
    },
    unsubscribePendingMatchAcceptanceEvent() {
      unsubscribePendingMatchAcceptanceEvent();
    },
    unsubscribeSendMatchInvitationEvent() {
      unsubscribeSendMatchInvitationEvent();
    },
    unsubscribeMatchPartnerRefuseMatchInvitationEvent() {
      unsubscribeMatchPartnerRefuseMatchInvitationEvent();
    },
    unsubscribeMatchPartnerUnavailableEvent() {
      unsubscribeMatchPartnerUnavailableEvent();
    },
    emitFindMatchPartnerEvent(user, combatRoomKey) {
      emitFindMatchPartnerEvent(user, combatRoomKey);
    },
    emitAcceptMatchInvitationEvent(combatRoomKey, guestUser) {
      emitAcceptMatchInvitationEvent(combatRoomKey, guestUser);
    },
    emitRefuseMatchInvitationEvent(combatRoomKey, guestUser) {
      emitRefuseMatchInvitationEvent(combatRoomKey, guestUser);
    },
    emitUserLoginEvent(user){
      emitUserLoginEvent(user);
    },
    emitUserLogoutEvent() {
      emitUserLogoutEvent();
    },
    emitFindMatchPartnerEndEvent(combatRoomKey) {
      emitFindMatchPartnerEndEvent(combatRoomKey);
    },
    emitSendRandomProblemEvent(problem, combatRoomKey, matchId) {
      emitSendRandomProblemEvent(problem, combatRoomKey, matchId);
    },
    emitKeyDownEvent(combatRoomKey) {
      emitKeyDownEvent(combatRoomKey);
    },
    emitKeyUpEvent(combatRoomKey) {
      emitKeyUpEvent(combatRoomKey);
    },
    emitUserWinningEvent(matchResult, combatRoomKey) {
      emitUserWinningEvent(matchResult, combatRoomKey);
    },
    emitUserGiveUpMatchEvent(combatRoomKey, user) {
      emitUserGiveUpMatchEvent(combatRoomKey, user);
    },
    emitUserSocketInitEvent(combatRoomKey, user) {
      emitUserSocketInitEvent(combatRoomKey, user);
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppComponent);
