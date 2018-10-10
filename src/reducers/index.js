import {
  SUCCESS_USER_AUTHENTICATE
} from '../constants/actionTypes';

const initialState = {
  token: ''
};

function reducer(state = initialState, action) {
  switch(action.type) {
    case SUCCESS_USER_AUTHENTICATE:
      return Object.assign({}, state, {
        token: action.token
      });
    default:
      return state;
  }
}

export default reducer;
