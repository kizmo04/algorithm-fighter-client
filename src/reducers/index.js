import {
  SUCCESS_USER_AUTHENTICATE,
  LOG_OUT_USER,
  OPEN_AUTH_MODAL,
  CLOSE_MODAL,
  OPEN_MATCHING_MODAL,
  INVITE_MATCH_USER,
  OPPONENT_ACCEPT_MATCH,
  GOT_MATCH_INVITATION,
  FINDING_FAILURE_OPPONENT_REJECT_COMBAT,
  FINDING_FAILURE_THERE_IS_NO_ONE,
} from '../constants/actionTypes';

const initialState = {
  token: '',
  user: {},
  isModalActive: false,
  modalType: '',
  modalMessage: '',
  matchingStage: 0,
  matchingUser: {},
  combatRoomKey: '',
};

function reducer(state = initialState, action) {
  switch(action.type) {
    case SUCCESS_USER_AUTHENTICATE:
      return Object.assign({}, state, {
        token: action.token,
        user: action.user,
        modalType: action.modalType,
        isModalActive: action.isModalActive,
      });
    case LOG_OUT_USER:
      return Object.assign({}, state, {
        token: action.token,
        modalType: action.modalType,
        isModalActive: action.isModalActive,
      });
    case OPEN_AUTH_MODAL:
      return Object.assign({}, state, {
        modalType: action.modalType,
        isModalActive: action.isModalActive,
      });
    case OPEN_MATCHING_MODAL:
      return Object.assign({}, state, {
        modalType: action.modalType,
        isModalActive: action.isModalActive,
        modalMessage: action.modalMessage,
        matchingStage: action.matchingStage,
      });
    case CLOSE_MODAL:
      return Object.assign({}, state, {
        modalType: action.modalType,
        isModalActive: action.isModalActive,
        modalMessage: action.modalMessage,
      });
    case INVITE_MATCH_USER:
      return Object.assign({}, state, {
        modalMessage: action.modalMessage,
        matchingStage: action.matchingStage,
        matchingUser: action.matchingUser,
      });
    case OPPONENT_ACCEPT_MATCH:
      return Object.assign({}, state, {
        modalMessage: action.modalMessage,
        matchingUser: action.matchingUser,
        matchingStage: action.matchingStage,
      });
    case GOT_MATCH_INVITATION:
      return Object.assign({}, state, {
        isModalActive: action.isModalActive,
        modalType: action.modalType,
        modalMessage: action.modalMessage,
        matchingUser: action.matchingUser,
        matchingStage: action.matchingStage,
        combatRoomKey: action.combatRoomKey,
      });
    case FINDING_FAILURE_THERE_IS_NO_ONE:
      return Object.assign({}, state, {
        modalMessage: action.modalMessage,
        matchingStage: action.matchingStage,
      });
    case FINDING_FAILURE_OPPONENT_REJECT_COMBAT:
      return Object.assign({}, state, {
        modalMessage: action.modalMessage,
        matchingStage: action.matchingStage,
        combatRoomKey: action.combatRoomKey,
      });
    default:
      return state;
  }
}

export default reducer;
