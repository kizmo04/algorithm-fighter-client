import {
  SUCCESS_USER_AUTHENTICATION,
  USER_LOGOUT,
  AUTH_MODAL_OPEN,
  MODAL_CLOSE,
  MATCH_MODAL_OPEN,
  PENDING_MATCH_ACCEPTANCE,
  RECEIVING_MATCH_INVITATION,
  MATCH_PARTNER_REFUSE_MATCH_INVITATION,
  MATCH_PARTNER_UNAVAILABLE,
  ACCEPT_MATCH_INVITATION,
  REFUSE_MATCH_INVITATION,
  MATCH_STARTED,
  MATCH_PREPARATION,
  MATCH_PROBLEM_FETCHED,
  MATCH_PARTNER_KEY_DOWN,
  MATCH_PARTNER_KEY_UP,
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
  APP_STAGE_RESET,
  USER_GIVE_UP_MATCH,
  MATCH_PARTNER_GIVE_UP_MATCH,
  REQUEST_USER_PAST_MATCH_RESULT,
  REQUEST_USER_PAST_SOLUTION_LIST,
} from '../constants/actionTypes';

const initialState = {
  token: '',
  user: {},
  isHost: true,
  isModalActive: false,
  modalType: '',
  modalMessage: '',
  appStage: '',
  matchPartner: {},
  combatRoomKey: '',
  problem: {},
  isMatchStarted: false,
  isMatchPartnerKeyPress: false,
  matchMessage: '',
  matchPartnerTestResult: {},
  matchPartnerCountPassed: 0,
  matchPartnerIsPassedAll: false,
  testResult: {},
  countPassed: 0,
  isPassedAll: false,
  code: 'function solution() {\n\n\n\n}\n',
  matchId: '',
  matchTime: '',
  isFetching: false,
  matchResultList: [],
  solutionList: [],
  expandedAccordionIndex: -1,
  matchResult: {},
};

function reducer(state = initialState, action) {
  switch(action.type) {
    case APP_STAGE_RESET:
      return Object.assign({}, state, {
        ...initialState,
        token: action.token,
        user: action.user,
        appStage: action.appStage,
        solutionList: action.solutionList,
        matchResultList: action.matchResultList,
      });
    case MATCH_TIMER:
      return Object.assign({}, state, {
        matchTime: action.matchTime,
      });
    case ACCEPT_MATCH_INVITATION:
      return Object.assign({}, state, {
        isModalActive: action.isModalActive,
        modalType: action.modalType,
        modalMessage: action.modalMessage,
        appStage: action.appStage,
      });
    case REFUSE_MATCH_INVITATION:
      return Object.assign({}, state, {
        isModalActive: action.isModalActive,
        modalType: action.modalType,
        modalMessage: action.modalMessage,
        appStage: action.appStage,
      });
    case SUCCESS_USER_AUTHENTICATION:
      return Object.assign({}, state, {
        token: action.token,
        user: action.user,
        modalType: action.modalType,
        isModalActive: action.isModalActive,
      });
    case USER_LOGOUT:
      return Object.assign({}, state, {
        token: action.token,
        modalType: action.modalType,
        isModalActive: action.isModalActive,
      });
    case AUTH_MODAL_OPEN:
      return Object.assign({}, state, {
        modalType: action.modalType,
        isModalActive: action.isModalActive,
      });
    case MATCH_MODAL_OPEN:
      return Object.assign({}, state, {
        modalType: action.modalType,
        isModalActive: action.isModalActive,
        modalMessage: action.modalMessage,
        appStage: action.appStage,
        isHost: true
      });
    case MODAL_CLOSE:
      return Object.assign({}, state, {
        modalType: action.modalType,
        isModalActive: action.isModalActive,
        modalMessage: action.modalMessage,
      });
    case PENDING_MATCH_ACCEPTANCE:
      return Object.assign({}, state, {
        modalMessage: action.modalMessage,
        appStage: action.appStage,
        matchPartner: action.matchPartner,
      });
    // case OPPONENT_ACCEPT_MATCH:
    //   return Object.assign({}, state, {
    //     modalMessage: action.modalMessage,
    //     matchPartner: action.matchPartner,
    //     appStage: action.appStage,
    //   });
    case RECEIVING_MATCH_INVITATION:
      return Object.assign({}, state, {
        isModalActive: action.isModalActive,
        modalType: action.modalType,
        modalMessage: action.modalMessage,
        matchPartner: action.matchPartner,
        appStage: action.appStage,
        combatRoomKey: action.combatRoomKey,
        isHost: false
      });
    case MATCH_PARTNER_UNAVAILABLE:
      return Object.assign({}, state, {
        modalMessage: action.modalMessage,
        appStage: action.appStage,
      });
    case MATCH_PARTNER_REFUSE_MATCH_INVITATION:
      return Object.assign({}, state, {
        modalMessage: action.modalMessage,
        appStage: action.appStage,
        combatRoomKey: action.combatRoomKey,
      });
    case MATCH_STARTED:
      return Object.assign({}, state, {
        appStage: action.appStage,
        problem: action.problem,
        isModalActive: action.isModalActive,
        modalMessage: action.modalMessage,
        modalType: action.modalType,
        isMatchStarted: action.isMatchStarted,
        matchId: action.matchId,
        matchTime: action.matchTime,
      });
    case MATCH_PREPARATION:
      return Object.assign({}, state, {
        appStage: action.appStage,
        modalMessage: action.modalMessage,
        matchPartner: action.matchPartner,
        combatRoomKey: action.combatRoomKey,
      });
    case MATCH_PROBLEM_FETCHED:
      return Object.assign({}, state, {
        appStage: action.appStage,
        modalMessage: action.modalMessage,
        problem: action.problem,
        matchId: action.matchId
      });
    case MATCH_PARTNER_KEY_DOWN:
      return Object.assign({}, state, {
        matchMessage: action.matchMessage,
        isMatchPartnerKeyPress: action.isMatchPartnerKeyPress,
      });
    case MATCH_PARTNER_KEY_UP:
      return Object.assign({}, state, {
        matchMessage: action.matchMessage,
        isMatchPartnerKeyPress: action.isMatchPartnerKeyPress,
      });
    case SUCCESS_SOLUTION_SUBMIT:
      return Object.assign({}, state, {
        testResult: action.testResult,
        countPassed: action.countPassed,
        isPassedAll: action.isPassedAll,
        isFetching: action.isFetching,
      });
    case MATCH_PARTNER_SOLUTION_SUBMITTED:
      return Object.assign({}, state, {
        matchPartnerTestResult: action.matchPartnerTestResult,
        matchPartnerCountPassed: action.matchPartnerCountPassed,
        matchPartnerIsPassedAll: action.matchPartnerIsPassedAll,
      });
    case CODE_CHANGED:
      return Object.assign({}, state, {
        code: action.code,
      });
    case REQUEST_SOLUTION_SUBMIT:
      return Object.assign({}, state, {
        isFetching: action.isFetching,
      });
    case REQUEST_USER_PAST_MATCH_RESULT:
      return Object.assign({}, state, {
        isFetching: action.isFetching,
      });
    case REQUEST_USER_PAST_SOLUTION_LIST:
      return Object.assign({}, state, {
        isFetching: action.isFetching,
      });
    case SUCCESS_USER_PAST_MATCH_RESULT:
      return Object.assign({}, state, {
        matchResultList: action.matchResultList,
        isFetching: action.isFetching,
      });
    case SUCCESS_USER_PAST_SOLUTION_LIST:
      return Object.assign({}, state, {
        solutionList: action.solutionList,
        isFetching: action.isFetching,
      });
    case ACCORDION_EXPANDED:
      return Object.assign({}, state, {
        expandedAccordionIndex: action.expandedAccordionIndex,
      });
    case ACCORDION_COLLAPSED:
      return Object.assign({}, state, {
        expandedAccordionIndex: action.expandedAccordionIndex,
      });
    case SUCCESS_MATCH_END:
      return Object.assign({}, state, {
        matchResult: action.matchResult,
        appStage: action.appStage,
        modalType: action.modalType,
        isModalActive: action.isModalActive,
      });
    case USER_GIVE_UP_MATCH:
      return Object.assign({}, state, {
        appStage: action.appStage,
        modalMessage: action.modalMessage,
        isMatchStarted: action.isMatchStarted,
        isModalActive: action.isModalActive,
      });
    case MATCH_PARTNER_GIVE_UP_MATCH:
      return Object.assign({}, state, {
        appStage: action.appStage,
        isModalActive: action.isModalActive,
        modalType: action.modalType,
        modalMessage: action.modalMessage,
      });
    default:
      return state;
  }
}

export default reducer;
