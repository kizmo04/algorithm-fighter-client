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
} from '../constants/actionTypes';

const initialState = {
  token: '',
  user: {},
  isModalActive: false,
  modalType: '',
  modalMessage: '',
  appStage: '',
  matchPartner: {},
  combatRoomKey: '',
};

function reducer(state = initialState, action) {
  switch(action.type) {
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
    default:
      return state;
  }
}

export default reducer;
