import React, { Component } from 'react';
import { connect } from 'react-redux';
import AppComponent from '../components/App/App';
import { signIn as signInGitHub, signOut as signOutGitHub } from '../utils/firebase';
import jwt from 'jsonwebtoken';
import { secret } from '../config/jwt';
import { successUserAuthenticate, logOutUser, activateAuthModal, deactivateAuthModal } from '../actions';
import { socket } from '../utils/socket';

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
            socket.emit('connect user', user);
          });
        })
        .catch(err => {
          console.log(err.message)
        });
      })
      .catch(err => {
        console.log(err.message)
      });
    },

    logoutUser() {
      signOutGitHub()
      .then(() => {
        dispatch(logOutUser());
      })
      .catch(err => {
        console.log(err);
      })
    },

    getUserInfo(token) {

    },

    handleActivateAuthModal() {
      dispatch(activateAuthModal());
    },

    handleDeactivateAuthModal() {
      dispatch(deactivateAuthModal());
    },
    findingMatch(user){
      console.log('client click finding match');
      socket.emit('find someone to match', user);
    }

  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppComponent);
