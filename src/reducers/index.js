import {
  SUCCESS_USER_AUTHENTICATE,
  LOG_OUT_USER,
  ACTIVATE_AUTH_MODAL,
  DEACTIVATE_AUTH_MODAL
} from '../constants/actionTypes';

const initialState = {
  token: '',
  isAuthModalActive: false,
  user: {}
};

function reducer(state = initialState, action) {
  switch(action.type) {
    case SUCCESS_USER_AUTHENTICATE:
      return Object.assign({}, state, {
        token: action.token,
        user: action.user
      });
    case LOG_OUT_USER:
      return Object.assign({}, state, {
        token: '',
        isAuthModalActive: false
      });
    case ACTIVATE_AUTH_MODAL:
      return Object.assign({}, state, {
        isAuthModalActive: true
      });
    case DEACTIVATE_AUTH_MODAL:
      return Object.assign({}, state, {
        isAuthModalActive: false
      });
    default:
      return state;
  }
}

export default reducer;
