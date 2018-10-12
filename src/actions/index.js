import {
  SUCCESS_USER_AUTHENTICATE,
  LOG_OUT_USER,
  OPEN_AUTH_MODAL,
  CLOSE_MODAL,
  OPEN_MATCHING_MODAL,
  INVITE_MATCH_USER,
  FIND_MATCH_USER_START,
  OPPONENT_ACCEPT_MATCH,
  GOT_MATCH_INVITATION,
} from '../constants/actionTypes';
import {
  AUTH,
  MATCHING,
  MATCHING_STAGE_1,
  MATCHING_STAGE_2,
  MATCHING_STAGE_3,
  MATCHING_STAGE_4,
  MATCHING_STAGE_5,
} from '../constants/modalTypes';
import {
  MESSAGE_FIND_MATCH_USER_START,
} from '../constants/messages';

export function successUserAuthenticate(token, user) {
  return {
    type: SUCCESS_USER_AUTHENTICATE,
    token,
    user,
    isModalActive: false,
    modalType: '',
  };
}

export function logOutUser() {
  return {
    type: LOG_OUT_USER,
    token: '',
    isModalActive: false,
    modalType: '',
  };
}

export function openAuthModal() {
  return {
    type: OPEN_AUTH_MODAL,
    isModalActive: true,
    modalType: AUTH,
  };
}

export function closeModal() {
  return {
    type: CLOSE_MODAL,
    isModalActive: false,
    modalType: '',
    modalMessage: '',
  };
}

export function openMatchingModal() {
  return {
    type: OPEN_MATCHING_MODAL,
    isModalActive: true,
    modalType: MATCHING,
    modalMessage: MESSAGE_FIND_MATCH_USER_START,
    matchingStage: MATCHING_STAGE_1,
  };
}

export function inviteMatchUser(user) {
  return {
    type: INVITE_MATCH_USER,
    modalMessage: `${user.email}님의 수락을 기다리는 중 입니다`,
    matchingStage: MATCHING_STAGE_2,
    matchingUser: user,
  };
}

export function opponentAcceptMatch(user) {
  return {
    type: OPPONENT_ACCEPT_MATCH,
    modalMessage: `${user.email}이 대결을 수락했습니다. 잠시만 기다려주세요.`,
    matchingStage: MATCHING_STAGE_3,
    matchingUser: user,
  };
}

export function gotMatchInvitation(user, combatRoomKey) {
  return {
    type: GOT_MATCH_INVITATION,
    isModalActive: true,
    modalType: MATCHING,
    modalMessage: `${user.email}님이 초대를 보냈습니다. 수락하시겠습니까?`,
    matchingStage: MATCHING_STAGE_4,
    matchingUser: user,
    combatRoomKey,
  };
}

