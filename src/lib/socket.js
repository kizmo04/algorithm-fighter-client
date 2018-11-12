import io from "socket.io-client";
import {
  SEND_MATCH_INVITATION,
  PENDING_MATCH_ACCEPTANCE,
  ACCEPT_MATCH_INVITATION,
  REFUSE_MATCH_INVITATION,
  MATCH_PARTNER_ENTERED,
  MATCH_PARTNER_UNAVAILABLE,
  MATCH_PARTNER_REFUSE_MATCH_INVITATION,
  FIND_MATCH_PARTNER,
  FIND_MATCH_PARTNER_END,
  USER_LOGOUT,
  USER_LOGIN,
  SEND_RANDOM_PROBLEM,
  MATCH_START,
  KEY_UP,
  KEY_DOWN,
  MATCH_PARTNER_KEY_DOWN,
  MATCH_PARTNER_KEY_UP,
  MATCH_PARTNER_SOLUTION_SUBMITTED,
  SOLUTION_SUBMITTED,
  MATCH_TIMER,
  USER_WINNING,
  MATCH_PARTNER_WINNING,
  USER_GIVE_UP,
  MATCH_PARTNER_GIVE_UP,
  USER_SOCKET_INIT
} from "../constants/socketEventTypes";
import { config } from "../config";

const { SOCKET_ROOT } = config;
const socket = io(SOCKET_ROOT);
const eventListenersMap = {};

export function subscribeMatchPartnerGiveUpEvent(cb) {
  const matchPartnerGiveUpEventListener = () => {
    cb();
  };
  eventListenersMap[MATCH_PARTNER_GIVE_UP] = matchPartnerGiveUpEventListener;

  socket.on(MATCH_PARTNER_GIVE_UP, matchPartnerGiveUpEventListener);
}

export function subscribeMatchPartnerWinningEvent(cb) {
  const matchPartnerWinningEventListener = matchResult => {
    cb(matchResult);
  };
  eventListenersMap[MATCH_PARTNER_WINNING] = matchPartnerWinningEventListener;

  socket.on(MATCH_PARTNER_WINNING, matchPartnerWinningEventListener);
}

export function subscribeMatchTimerEvent(cb) {
  const matchTimerEventListener = time => {
    cb(time);
  };
  eventListenersMap[MATCH_TIMER] = matchTimerEventListener;

  socket.on(MATCH_TIMER, matchTimerEventListener);
}

export function subscribeMatchPartnerSolutionSubmittedEvent(cb) {
  const matchPartnerSolutionSubmittedEventListener = (
    matchPartnerTestResult,
    matchPartnerCountPassed,
    matchPartnerIsPassedAll
  ) => {
    cb(
      matchPartnerTestResult,
      matchPartnerCountPassed,
      matchPartnerIsPassedAll
    );
  };
  eventListenersMap[
    MATCH_PARTNER_SOLUTION_SUBMITTED
  ] = matchPartnerSolutionSubmittedEventListener;

  socket.on(
    MATCH_PARTNER_SOLUTION_SUBMITTED,
    matchPartnerSolutionSubmittedEventListener
  );
}

export function emitSolutionSubmittedEvent(
  testResult,
  countPassed,
  isPassedAll,
  combatRoomKey
) {
  socket.emit(
    SOLUTION_SUBMITTED,
    testResult,
    countPassed,
    isPassedAll,
    combatRoomKey
  );
}

export function subscribeMatchPartnerKeyDownEvent(cb) {
  const matchPartnerKeyDownEventListener = () => {
    cb();
  };
  eventListenersMap[MATCH_PARTNER_KEY_DOWN] = matchPartnerKeyDownEventListener;

  socket.on(MATCH_PARTNER_KEY_DOWN, matchPartnerKeyDownEventListener);
}

export function subscribeMatchPartnerKeyUpEvent(cb) {
  const matchPartnerKeyUpEventListener = () => {
    cb();
  };
  eventListenersMap[MATCH_PARTNER_KEY_UP] = matchPartnerKeyUpEventListener;

  socket.on(MATCH_PARTNER_KEY_UP, matchPartnerKeyUpEventListener);
}

export function emitKeyDownEvent(combatRoomKey) {
  socket.emit(KEY_DOWN, combatRoomKey);
}

export function emitKeyUpEvent(combatRoomKey) {
  socket.emit(KEY_UP, combatRoomKey);
}

export function subscribeMatchStartEvent(cb) {
  const matchStartEventListener = (problem, matchId, matchTime) => {
    cb(problem, matchId, matchTime);
  };
  eventListenersMap[MATCH_START] = matchStartEventListener;

  socket.on(MATCH_START, matchStartEventListener);
}

export function emitSendRandomProblemEvent(problem, combatRoomKey, matchId) {
  socket.emit(SEND_RANDOM_PROBLEM, problem, combatRoomKey, matchId);
}

export function subscribeMatchPartnerEnteredEvent(cb) {
  const matchPartnerEnteredEventListener = (matchPartner, combatRoomKey) => {
    cb(matchPartner, combatRoomKey);
  };
  eventListenersMap[MATCH_PARTNER_ENTERED] = matchPartnerEnteredEventListener;

  socket.on(MATCH_PARTNER_ENTERED, matchPartnerEnteredEventListener);
}

export function unsubscribeMatchPartnerEnteredEvent() {
  if (eventListenersMap[MATCH_PARTNER_ENTERED]) {
    socket.off(MATCH_PARTNER_ENTERED, eventListenersMap[MATCH_PARTNER_ENTERED]);
  }
}

export function subscribePendingMatchAcceptanceEvent(cb) {
  const pendingMatchAcceptanceEventListener = guestUser => {
    cb(guestUser);
  };

  eventListenersMap[
    PENDING_MATCH_ACCEPTANCE
  ] = pendingMatchAcceptanceEventListener;

  socket.on(PENDING_MATCH_ACCEPTANCE, pendingMatchAcceptanceEventListener);
}

export function unsubscribePendingMatchAcceptanceEvent() {
  if (eventListenersMap[PENDING_MATCH_ACCEPTANCE]) {
    socket.off(
      PENDING_MATCH_ACCEPTANCE,
      eventListenersMap[PENDING_MATCH_ACCEPTANCE]
    );
  }
}

export function subscribeSendMatchInvitationEvent(cb) {
  const sendMatchInvitationEventListener = (hostUser, combatRoomKey) => {
    cb(hostUser, combatRoomKey);
  };
  eventListenersMap[SEND_MATCH_INVITATION] = sendMatchInvitationEventListener;

  socket.on(SEND_MATCH_INVITATION, sendMatchInvitationEventListener);
}

export function unsubscribeSendMatchInvitationEvent() {
  if (eventListenersMap[SEND_MATCH_INVITATION]) {
    socket.off(SEND_MATCH_INVITATION, eventListenersMap[SEND_MATCH_INVITATION]);
  }
}

export function subscribeMatchPartnerRefuseMatchInvitationEvent(cb) {
  const matchPartnerRefuseMatchInvitationEventListener = combatRoomKey => {
    cb(combatRoomKey);
  };
  socket.on(
    MATCH_PARTNER_REFUSE_MATCH_INVITATION,
    matchPartnerRefuseMatchInvitationEventListener
  );
  eventListenersMap[
    MATCH_PARTNER_REFUSE_MATCH_INVITATION
  ] = matchPartnerRefuseMatchInvitationEventListener;
}

export function unsubscribeMatchPartnerRefuseMatchInvitationEvent() {
  if (eventListenersMap[MATCH_PARTNER_REFUSE_MATCH_INVITATION]) {
    socket.off(
      MATCH_PARTNER_REFUSE_MATCH_INVITATION,
      eventListenersMap[MATCH_PARTNER_REFUSE_MATCH_INVITATION]
    );
  }
}

export function subscribeMatchPartnerUnavailableEvent(cb) {
  const matchPartnerUnavailableEventListener = () => {
    cb();
  };
  socket.on(MATCH_PARTNER_UNAVAILABLE, matchPartnerUnavailableEventListener);

  eventListenersMap[
    MATCH_PARTNER_UNAVAILABLE
  ] = matchPartnerUnavailableEventListener;
}

export function unsubscribeMatchPartnerUnavailableEvent() {
  if (eventListenersMap[MATCH_PARTNER_UNAVAILABLE]) {
    socket.off(
      MATCH_PARTNER_UNAVAILABLE,
      eventListenersMap[MATCH_PARTNER_UNAVAILABLE]
    );
  }
}

export function emitFindMatchPartnerEvent(hostUser, prevCombatRoomKey) {
  socket.emit(FIND_MATCH_PARTNER, hostUser, prevCombatRoomKey);
}

export function emitFindMatchPartnerEndEvent(combatRoomKey) {
  socket.emit(FIND_MATCH_PARTNER_END, combatRoomKey);
}

export function emitAcceptMatchInvitationEvent(combatRoomKey, matchPartner) {
  socket.emit(ACCEPT_MATCH_INVITATION, combatRoomKey, matchPartner);
}

export function emitRefuseMatchInvitationEvent(combatRoomKey, guestUser) {
  socket.emit(REFUSE_MATCH_INVITATION, combatRoomKey, guestUser);
}

export function emitUserLoginEvent(user) {
  socket.emit(USER_LOGIN, user);
}

export function emitUserLogoutEvent() {
  socket.emit(USER_LOGOUT);
}

export function emitUserWinningEvent(matchResult, combatRoomKey) {
  socket.emit(USER_WINNING, matchResult, combatRoomKey);
}

export function emitUserGiveUpMatchEvent(combatRoomKey, user) {
  socket.emit(USER_GIVE_UP, combatRoomKey, user);
}

export function emitUserSocketInitEvent(combatRoomKey, user) {
  socket.emit(USER_SOCKET_INIT, combatRoomKey, user);
}
