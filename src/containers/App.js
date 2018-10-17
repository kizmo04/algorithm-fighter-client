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
} from '../actions';
import {
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
} from '../lib/socket';
import { MATCH } from '../constants/modalTypes';
import { config } from '../config';

const { JWT_SECRET, ROOT } = config;

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
    async fetchRandomProblem(userIdOrProblemId, matchPartnerId, combatRoomKey, token) {
      try {
        let problem, matchId;
        if (matchPartnerId) {
          const responseRandomProblem = await fetch(`${ROOT}/api/problems/random?u_id=${userIdOrProblemId}&p_id=${matchPartnerId}`, {
            method: "GET",
            mode: "cors",
            headers: {
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
              host_id: userIdOrProblemId,
              guest_id: matchPartnerId,
            })
          });
          const bodyNewMatch = await responseNewMatch.json();
          matchId = bodyNewMatch._id;
        } else {
          const response = await fetch(`${ROOT}/api/problems/${userIdOrProblemId}`);
          const body = await response.json();
          problem = body.problem;
        }
        dispatch(matchProblemFetched(problem, matchId));
        emitSendRandomProblemEvent(problem, combatRoomKey, matchId);
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
        let intervalCountPassed = 0;
        const intervalId = setInterval(() => {
          if (Math.round(intervalCountPassed * 100) === countPassed * 100) {
            clearInterval(intervalId);
          } else {
            intervalCountPassed += countPassed / 10;
            dispatch(successSolutionSubmit(testResult, intervalCountPassed, isPassedAll));
            emitSolutionSubmittedEvent(testResult, intervalCountPassed, isPassedAll, combatRoomKey);
          }
        }, 100);
      } catch(err) {
        console.log(err);
      }
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
    changeCode(editor, data, code) {
      dispatch(codeChanged(code));
    },
    closeModal() {
      dispatch(modalClose());
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
      subscribeMatchStartEvent((problem,matchId) => {
        dispatch(matchStarted(problem, matchId));
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
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppComponent);
