import { connect } from 'react-redux';
import AppComponent from '../components/App/App';
import { signIn as signInGitHub, signOut as signOutGitHub } from '../utils/firebase';
import jwt from 'jsonwebtoken';
import { secret } from '../config/jwt';
import { successUserAuthenticate, logOutUser, activateAuthModal, deactivateAuthModal } from '../actions';

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
          dispatch(successUserAuthenticate(token));
        })
        .catch(err => {
          console.log(err)
        });
      })
      .catch(err => {
        console.log(err)
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
      jwt.verify(token, secret, function(err, decoded) {
        console.log(decoded);
      });
    },

    handleActivateAuthModal() {
      dispatch(activateAuthModal());
    },

    handleDeactivateAuthModal() {
      dispatch(deactivateAuthModal());
    }

  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppComponent);
