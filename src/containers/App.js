import { connect } from 'react-redux';
import AppComponent from '../components/App/App';
import { signIn as signInGitHub, signOut as signOutGitHub } from '../utils/firebase';
import { successUserAuthenticate } from '../actions';

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
        .then(response => response.json())
        .then(body => {
          const { user, token } = body;
          const { email, joined_date, name, profile_image_url, short_bio, solutions, user_name, _id } = user;
          dispatch(successUserAuthenticate(token));
        })
        .catch(err => {
          console.log(err);
        });
      })
      .catch(err => {
        console.log(err)
      });

    },
    logoutUser() {
      signOutGitHub()
      .then(() => {

      })
      .catch(err => {
        console.log(err);
      })
    }

  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppComponent);
