import {
  SUCCESS_USER_AUTHENTICATE,
  LOG_OUT_USER,
  ACTIVATE_AUTH_MODAL,
  DEACTIVATE_AUTH_MODAL
} from '../constants/actionTypes';

export function successUserAuthenticate(token) {
  return {
    type: SUCCESS_USER_AUTHENTICATE,
    token
  };
}

export function logOutUser() {
  return {
    type: LOG_OUT_USER
  };
}

export function activateAuthModal() {
  return {
    type: ACTIVATE_AUTH_MODAL
  };
}

export function deactivateAuthModal() {
  return {
    type: DEACTIVATE_AUTH_MODAL
  };
}
