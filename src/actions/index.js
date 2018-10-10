import {
  SUCCESS_USER_AUTHENTICATE
} from '../constants/actionTypes';


export function successUserAuthenticate(token) {
  return {
    type: SUCCESS_USER_AUTHENTICATE,
    token
  };
}