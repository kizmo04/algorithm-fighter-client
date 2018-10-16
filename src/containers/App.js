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
  solutionSubmitted,
  matchPartnerSolutionSubmitted,
} from '../actions';
import {
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
            const { _id, name, userName, profileImageUrl, email, shortBio } = decoded;
            const user = {
              _id,
              name,
              userName,
              profileImageUrl,
              email,
              shortBio,
            };
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
        dispatch(userLogout());
      })
      .catch(err => {
        console.log(err);
      })
    },
    async fetchRandomProblem(userIdOrProblemId, matchPartnerId) {
      try {
        let problem;
        if (matchPartnerId) {
          const response = await fetch(`${ROOT}/api/problems/random?u_id=${userIdOrProblemId}&p_id=${matchPartnerId}`);
          const body = await response.json();
          problem = body.problem;
        } else {
          const response = await fetch(`${ROOT}/api/problems/${userIdOrProblemId}`);
          const body = await response.json();
          problem = body.problem;
        }
        dispatch(matchProblemFetched(problem));
      } catch(err) {
        console.log(err);
      }
    },
    async submitSolution(userId, code, problemId, token, combatRoomKey) {
      try {
        console.log(userId, code, problemId, token, combatRoomKey);
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
        console.log(body)
        const { testResult, countPassed, isPassedAll } = body;
        console.log('code submitted', testResult, countPassed, isPassedAll)
        dispatch(solutionSubmitted(testResult, countPassed, isPassedAll));
        emitSolutionSubmittedEvent(testResult, countPassed, isPassedAll, combatRoomKey);
      } catch(err) {
        console.log(err);
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
      subscribeMatchStartEvent(problem => {
        dispatch(matchStarted(problem));
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
      emitFindMatchPartnerEvent({ hostUser: user, prevCombatRoomKey: combatRoomKey });
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
    emitSendRandomProblemEvent(problem, combatRoomKey) {
      emitSendRandomProblemEvent(problem, combatRoomKey);
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
