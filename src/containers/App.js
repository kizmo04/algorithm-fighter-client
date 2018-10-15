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
} from '../actions';
import {
  subscribePendingMatchAcceptanceEvent,
  subscribeSendMatchInvitationEvent,
  subscribeMatchPartnerRefuseMatchInvitationEvent,
  subscribeMatchPartnerUnavailableEvent,
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
            const { name, userName, profileImageUrl, email, shortBio } = decoded;
            const user = {
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
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppComponent);
