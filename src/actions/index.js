import {
  SUCCESS_USER_AUTHENTICATION,
  USER_LOGOUT,
  AUTH_MODAL_OPEN,
  MODAL_CLOSE,
  MATCH_MODAL_OPEN,
  PENDING_MATCH_ACCEPTANCE,
  RECEIVING_MATCH_INVITATION,
  MATCH_PARTNER_UNAVAILABLE,
  MATCH_PARTNER_REFUSE_MATCH_INVITATION,
  REFUSE_MATCH_INVITATION,
  ACCEPT_MATCH_INVITATION,
  MATCH_PREPARATION,
  MATCH_PROBLEM_FETCHED,
  MATCH_STARTED,
  MATCH_PARTNER_KEY_UP,
  MATCH_PARTNER_KEY_DOWN,
  MATCH_PARTNER_SOLUTION_SUBMITTED,
  CODE_CHANGED,
  MATCH_TIMER,
  REQUEST_SOLUTION_SUBMIT,
  SUCCESS_SOLUTION_SUBMIT,
  SUCCESS_USER_PAST_MATCH_RESULT,
  SUCCESS_USER_PAST_SOLUTION_LIST,
  ACCORDION_EXPANDED,
  ACCORDION_COLLAPSED,
  SUCCESS_MATCH_END,
} from '../constants/actionTypes';
import {
  AUTH,
  MATCH,
  APP_STAGE_FIND_MATCH_PARTNER,
  APP_STAGE_PENDING_MATCH_ACCEPTANCE,
  APP_STAGE_RECEIVING_MATCH_INVITATION,
  APP_STAGE_MATCH_PARTNER_REFUSE_MATCH_INVITATION,
  APP_STAGE_MATCH_PARTNER_UNAVAILABLE,
  APP_STAGE_REFUSE_MATCH_INVITATION,
  APP_STAGE_ACCEPT_MATCH_INVITATION,
  APP_STAGE_MATCH_PREPARATION,
  APP_STAGE_MATCH_PROBLEM_FETCHED,
  APP_STAGE_MATCH_STARTED,
  APP_STAGE_MATCH_END,
  APP_STAGE_MATCH_SUSPENDED,
} from '../constants/modalTypes';
import {
  MESSAGE_FIND_MATCH_PARTNER,
  MESSAGE_MATCH_PARTNER_UNAVAILABLE,
  MESSAGE_MATCH_PARTNER_REFUSE_MATCH_INVITATION,
  MESSAGE_MATCH_PREPARATION,
  MESSAGE_MATCH_PROBLEM_FETCHED,
  MESSAGE_MATCH_PARTNER_KEY_DOWN,
  MESSAGE_MATCH_PARTNER_SOLUTION_SUBMITTED,
} from '../constants/messages';

export function successUserAuthentication(token, user) {
  return {
    type: SUCCESS_USER_AUTHENTICATION,
    token,
    user,
    isModalActive: false,
    modalType: '',
  };
}

export function userLogout() {
  return {
    type: USER_LOGOUT,
    token: '',
    isModalActive: false,
    modalType: '',
  };
}

export function authModalOpen() {
  return {
    type: AUTH_MODAL_OPEN,
    isModalActive: true,
    modalType: AUTH,
  };
}

export function modalClose() {
  return {
    type: MODAL_CLOSE,
    isModalActive: false,
    modalType: '',
    modalMessage: '',
  };
}

export function refuseMatchInvitation() {
  return {
    type: REFUSE_MATCH_INVITATION,
    isModalActive: false,
    modalType: '',
    modalMessage: '',
    appStage: APP_STAGE_REFUSE_MATCH_INVITATION,
  };
}

export function acceptMatchInvitation() {
  return {
    type: ACCEPT_MATCH_INVITATION,
    isModalActive: false,
    modalType: '',
    modalMessage: '',
    appStage: APP_STAGE_ACCEPT_MATCH_INVITATION,
  };
}

export function matchModalOpen() {
  return {
    type: MATCH_MODAL_OPEN,
    isModalActive: true,
    modalType: MATCH,
    modalMessage: MESSAGE_FIND_MATCH_PARTNER,
    appStage: APP_STAGE_FIND_MATCH_PARTNER,
  };
}

export function pendingMatchAcceptance(matchPartner) {
  return {
    type: PENDING_MATCH_ACCEPTANCE,
    modalMessage: `${matchPartner.userName}의 수락을 기다리는 중 입니다`,
    appStage: APP_STAGE_PENDING_MATCH_ACCEPTANCE,
    matchPartner,
  };
}

// export function opponentAcceptMatch(user) {
//   return {
//     type: OPPONENT_ACCEPT_MATCH,
//     modalMessage: `${user.email}이 대결을 수락했습니다. 잠시만 기다려주세요.`,
//     appStage: APP_STAGE_3,
//     matchPartner: user,
//   };
// }

export function receivingMatchInvitation(matchPartner, combatRoomKey) {
  return {
    type: RECEIVING_MATCH_INVITATION,
    isModalActive: true,
    modalType: MATCH,
    modalMessage: `${matchPartner.email}님이 초대를 보냈습니다. 수락하시겠습니까?`,
    appStage: APP_STAGE_RECEIVING_MATCH_INVITATION,
    matchPartner,
    combatRoomKey,
  };
}

export function matchPartnerUnavailable() {
  return {
    type: MATCH_PARTNER_UNAVAILABLE,
    modalMessage: MESSAGE_MATCH_PARTNER_UNAVAILABLE,
    appStage: APP_STAGE_MATCH_PARTNER_UNAVAILABLE,
  }
}

export function matchPartnerRefuseMatchInvitation(combatRoomKey) {
  return {
    type: MATCH_PARTNER_REFUSE_MATCH_INVITATION,
    modalMessage: MESSAGE_MATCH_PARTNER_REFUSE_MATCH_INVITATION,
    appStage: APP_STAGE_MATCH_PARTNER_REFUSE_MATCH_INVITATION,
    combatRoomKey,
  };
}

export function matchPreparation(matchPartner, combatRoomKey) {
  return {
    type: MATCH_PREPARATION,
    appStage: APP_STAGE_MATCH_PREPARATION,
    modalMessage: MESSAGE_MATCH_PREPARATION,
    matchPartner,
    combatRoomKey,
  };
}

export function matchProblemFetched(problem, matchId) {
  return {
    type: MATCH_PROBLEM_FETCHED,
    appStage: APP_STAGE_MATCH_PROBLEM_FETCHED,
    modalMessage: MESSAGE_MATCH_PROBLEM_FETCHED,
    problem,
    matchId,
  };
}

export function matchStarted(problem, matchId, matchTime) {
  return {
    type: MATCH_STARTED,
    appStage: APP_STAGE_MATCH_STARTED,
    problem,
    isModalActive: false,
    modalMessage: '',
    modalType: '',
    isMatchStarted: true,
    matchId,
    matchTime,
  };
}

export function matchPartnerKeyDown() {
  return {
    type: MATCH_PARTNER_KEY_DOWN,
    matchMessage: MESSAGE_MATCH_PARTNER_KEY_DOWN,
    isMatchPartnerKeyPress: true,
  };
}

export function matchPartnerKeyUp() {
  return {
    type: MATCH_PARTNER_KEY_UP,
    matchMessage: '',
    isMatchPartnerKeyPress: false,
  };
}

export function successSolutionSubmit(testResult, countPassed, isPassedAll, isFetching = true) {
  return {
    type: SUCCESS_SOLUTION_SUBMIT,
    testResult,
    countPassed,
    isPassedAll,
    isFetching,
  };
}

export function matchPartnerSolutionSubmitted(matchPartnerTestResult, matchPartnerCountPassed, matchPartnerIsPassedAll) {
  return {
    type: MATCH_PARTNER_SOLUTION_SUBMITTED,
    matchPartnerTestResult,
    matchPartnerCountPassed,
    matchPartnerIsPassedAll,
  };
}

export function codeChanged(code) {
  return {
    type: CODE_CHANGED,
    code,
  };
}

export function matchTimer (matchTime) {
  return {
    type: MATCH_TIMER,
    matchTime,
  };
}

export function requestSolutionSubmit() {
  return {
    type: REQUEST_SOLUTION_SUBMIT,
    isFetching: true,
  };
}

export function successUserPastMatchResult(matchResultList) {
  return {
    type: SUCCESS_USER_PAST_MATCH_RESULT,
    matchResultList,
  };
}

export function successUserPastSolutionList(solutionList) {
  return {
    type: SUCCESS_USER_PAST_SOLUTION_LIST,
    solutionList,
  };
}

export function accordionExpanded(index) {
  return {
    type: ACCORDION_EXPANDED,
    expandedAccordionIndex: index,
  };
}

export function accordionCollapsed() {
  return {
    type: ACCORDION_COLLAPSED,
    expandedAccordionIndex: -1,
  };
}

export function successMatchEnd(matchResult) {
  return {
    type: SUCCESS_MATCH_END,
    appStage: APP_STAGE_MATCH_END,
    matchResult,
    isModalActive: true,
    modalType: MATCH,
  };
}
