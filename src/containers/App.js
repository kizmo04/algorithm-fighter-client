import React, { Component } from 'react';
import { connect } from 'react-redux';
import AppComponent from '../components/App/App';
import { signIn as signInGitHub, signOut as signOutGitHub } from '../lib/firebase';
import jwt from 'jsonwebtoken';
import { secret } from '../config/jwt';
import { socket } from '../lib/socket';
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { 
  successUserAuthenticate,
  logOutUser,
  openAuthModal,
  closeModal,
  openMatchingModal,
  inviteMatchUser,
  gotMatchInvitation,
  findingFailureOpponentRejectCombat,
  findingFailureThereIsNoOne
} from '../actions';
import {
  emitAcceptMatchInvitationEvent,
  emitRefuseMatchInvitationEvent,
  subscribePendingMatchAcceptanceEvent,
  subscribeSendMatchInvitationEvent,
  subscribeMatchPartnerRefuseMatchInvitationEvent,
  subscribeMatchPartnerUnavailableEvent,
} from '../lib/socket';
import {
  USER_LOGOUT,
  USER_LOGIN,
  FIND_MATCH_PARTNER,
} from '../constants/socketEventTypes';
// import { github } from '@fortawesome/free-solid-svg-icons'

library.add(fab);

const mapStateToProps = state => Object.assign({}, state);

const mapDispatchToProps = dispatch => {
  return {
    authenticateUser () {
      signInGitHub()
      .then(result => {
        const { email, displayName, photoURL} = result.user;
        const { bio, login } = result.additionalUserInfo.profile;
        fetch('http://localhost:5000/api/auth', {
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
            profile_image_url: photoURL
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
          jwt.verify(token, secret, function(err, decoded) {
            if (err) {
              console.log(err);
            }
            const { name, userName, profileImageUrl, email, shortBio } = decoded;
            const user = {
              name,
              userName,
              profileImageUrl,
              email,
              shortBio
            };
            dispatch(successUserAuthenticate(token, user));
            // const socket = io('http://localhost:5000/waiting', { transports: ['websocket']});
            socket.emit(USER_LOGIN, user);
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
        dispatch(logOutUser());
        socket.emit(USER_LOGOUT);
      })
      .catch(err => {
        console.log(err);
      })
    },

    getUserInfo(token) {

    },

    handleOpenAuthModal() {
      dispatch(openAuthModal());
    },

    handleCloseModal() {
      dispatch(closeModal());
    },
    findingMatchOrLogin(user, combatRoomKey){
      if (Object.keys(user).length) {
        socket.emit(FIND_MATCH_PARTNER, { hostUser: user, prevCombatRoomKey: combatRoomKey});
        dispatch(openMatchingModal());
        subscribePendingMatchAcceptanceEvent(user => {
          dispatch(inviteMatchUser(user));
        });
        subscribeMatchPartnerRefuseMatchInvitationEvent(combatRoomKey => {
          console.log('subscribe refuse match invitation')
          dispatch(findingFailureOpponentRejectCombat(combatRoomKey));
        });
        subscribeMatchPartnerUnavailableEvent(() => {
          dispatch(findingFailureThereIsNoOne());
        });
      } else {
        dispatch(openAuthModal());
      }
    },
    subscribeSendMatchInvitationEvent() {
      subscribeSendMatchInvitationEvent((hostUser, combatRoomKey) => {
        dispatch(gotMatchInvitation(hostUser, combatRoomKey));
      });
    },
    emitAcceptMatchInvitationEvent({ combatRoomKey, guestUser }) {
      emitAcceptMatchInvitationEvent(({ combatRoomKey, guestUser }) => {
        dispatch(closeModal({ combatRoomKey }));
      }, {combatRoomKey, guestUser});
    },
    emitRefuseMatchInvitationEvent({ combatRoomKey, guestUser }) {
      emitRefuseMatchInvitationEvent(({ combatRoomKey, guestUser }) => {
        dispatch(closeModal({ combatRoomKey }));
      }, {combatRoomKey, guestUser});
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppComponent);
