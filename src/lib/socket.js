import io from 'socket.io-client';
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
  USER_SOCKET_INIT,
} from '../constants/socketEventTypes';
// import { config } from '../config';

// const { ROOT } = config;

let ROOT;

if (process.env.NODE_ENV === 'development') {
  ROOT = 'http://api-dev.kizmo04.com';
} else if (process.env.NODE_ENV === 'production') {
  ROOT = 'http://api.kizmo04.com';
}

const socket = io('http://localhost:5000', {
  reconnection: true,
  transports: ['websocket', 'polling']
});

const eventListenersMap = {};

// socket.on(MATCH_PARTNER_ENTERED, ({hostUser, combatRoomKey, guestSocketId, hostSocketId, guestUser, participants}) => {
  // 안내 메세지 현재 두 클라이언트가 같은 room 에 join한 시점
  // GET random problem (host id, guest id 필요),
  // 문제를 받으면 client emit ('READY_TO_FIGHT', user) - 각자 user 정보 보내줌
  // server on ('READY_TO_FIGHT', user => 여기에서 create match 해야할 것 같음 )
  // server emit('MATCH_STARTED', { user2, match_id }) - 유저 정보 묶어서 내려줌, 서버 타이머 시작
  // client on ('MATCH_STARTED', ({ user2, match_id }) => /match/match_id 문제풀이 화면으로 넘어가기
  // 문제풀이 화면에는 두 유저의 정보와 에디터
  // 문제 풀이 시작하면서 발생하는 이벤트 : keyboard typing, submit solution and display progress bar, 패배 승리
// });

// 한명이 승리한 경우
// socket.emit('winning')
// socket.on('match partner winning')

// onSubmit - put check solution 요청뒤에
// socket.emit('test pass', { countPassed, isPassedAll });

// socket.on('match partner test pass', { countPassed, isPassedAll })

// 키보드 이벤트 감지, - keypress debounce 5000
// socket.emit('typing')
// socket.on('match partner typing')

// 중간에 나가는 경우
// socket.on('match partner leaving');
// 안내 메세지 이후 게임중지 - 제한시간안에 풀면 승리. - 나가기 버튼
// socket.emit('leaving')
// 서버 'disconnect' 이벤트 리스너에서 끊어진 소켓이 게임중인지 아닌지 알아내는 로직 필요

// 시간이 초과된 경우
// 이것은 소켓이벤트 말고 각자 처리?
// 혹은 서버에서 타이머를 돌리고 소켓 클라이언트들이 받아서 보여줌
// 타이머 종료되면 서버에서 종료메세지 띄움.

export function subscribeMatchPartnerGiveUpEvent(cb) {
  const matchPartnerGiveUpEventListener = () => {
    console.log('subs partner give up');
    cb();
  };
  eventListenersMap[MATCH_PARTNER_GIVE_UP] = matchPartnerGiveUpEventListener;

  socket.on(MATCH_PARTNER_GIVE_UP, matchPartnerGiveUpEventListener);
}

export function subscribeMatchPartnerWinningEvent(cb) {
  const matchPartnerWinningEventListener = (matchResult) => {
    cb(matchResult);
  };
  eventListenersMap[MATCH_PARTNER_WINNING] = matchPartnerWinningEventListener;

  socket.on(MATCH_PARTNER_WINNING, matchPartnerWinningEventListener);
}

export function subscribeMatchTimerEvent(cb) {
  const matchTimerEventListener = (time) => {
    cb(time);
  };

  eventListenersMap[MATCH_TIMER] = matchTimerEventListener;

  socket.on(MATCH_TIMER, matchTimerEventListener);
}

export function subscribeMatchPartnerSolutionSubmittedEvent(cb) {
  const matchPartnerSolutionSubmittedEventListener = (matchPartnerTestResult, matchPartnerCountPassed, matchPartnerIsPassedAll) => {
    console.log('partner solution submitted')
    cb(matchPartnerTestResult, matchPartnerCountPassed, matchPartnerIsPassedAll);
  };

  eventListenersMap[MATCH_PARTNER_SOLUTION_SUBMITTED] = matchPartnerSolutionSubmittedEventListener;

  socket.on(MATCH_PARTNER_SOLUTION_SUBMITTED, matchPartnerSolutionSubmittedEventListener);
}

export function emitSolutionSubmittedEvent(testResult, countPassed, isPassedAll, combatRoomKey) {
  socket.emit(SOLUTION_SUBMITTED, testResult, countPassed, isPassedAll, combatRoomKey);
}

export function subscribeMatchPartnerKeyDownEvent(cb) {
  const matchPartnerKeyDownEventListener = () => {
    console.log('subs partner key down!')
    cb();
  };

  eventListenersMap[MATCH_PARTNER_KEY_DOWN] = matchPartnerKeyDownEventListener;

  socket.on(MATCH_PARTNER_KEY_DOWN, matchPartnerKeyDownEventListener);
}

export function subscribeMatchPartnerKeyUpEvent(cb) {
  const matchPartnerKeyUpEventListener = () => {
    console.log('subs partner key Up!')
    cb();
  };

  eventListenersMap[MATCH_PARTNER_KEY_UP] = matchPartnerKeyUpEventListener;

  socket.on(MATCH_PARTNER_KEY_UP, matchPartnerKeyUpEventListener);
}

export function emitKeyDownEvent(combatRoomKey) {
  console.log('emit keyDown: ', combatRoomKey)
  socket.emit(KEY_DOWN, combatRoomKey);
}

export function emitKeyUpEvent(combatRoomKey) {
  console.log('emit keyUp: ', combatRoomKey)
  socket.emit(KEY_UP, combatRoomKey);
}

export function subscribeMatchStartEvent(cb) {
  const matchStartEventListener = (problem, matchId, matchTime) => {
    console.log('in match start on!')
    cb(problem, matchId, matchTime);
  };

  eventListenersMap[MATCH_START] = matchStartEventListener;

  socket.on(MATCH_START, matchStartEventListener);
}

export function emitSendRandomProblemEvent(problem, combatRoomKey, matchId) {
  console.log('send problem: ', problem)
  socket.emit(SEND_RANDOM_PROBLEM, problem, combatRoomKey, matchId);
}

export function subscribeMatchPartnerEnteredEvent(cb) {
  const matchPartnerEnteredEventListener = (matchPartner, combatRoomKey) => {
    console.log('match partner entered', combatRoomKey)
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

  eventListenersMap[PENDING_MATCH_ACCEPTANCE] = pendingMatchAcceptanceEventListener;

  socket.on(PENDING_MATCH_ACCEPTANCE, pendingMatchAcceptanceEventListener);
}

export function unsubscribePendingMatchAcceptanceEvent() {
  if (eventListenersMap[PENDING_MATCH_ACCEPTANCE]) {
    socket.off(PENDING_MATCH_ACCEPTANCE, eventListenersMap[PENDING_MATCH_ACCEPTANCE]);
  }
}

export function subscribeSendMatchInvitationEvent(cb) {
  const sendMatchInvitationEventListener = (hostUser, combatRoomKey) => {
    console.log('subs send invitation')
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
  socket.on(MATCH_PARTNER_REFUSE_MATCH_INVITATION, matchPartnerRefuseMatchInvitationEventListener);

  eventListenersMap[MATCH_PARTNER_REFUSE_MATCH_INVITATION] = matchPartnerRefuseMatchInvitationEventListener;
}

export function unsubscribeMatchPartnerRefuseMatchInvitationEvent() {
  if (eventListenersMap[MATCH_PARTNER_REFUSE_MATCH_INVITATION]) {
    socket.off(MATCH_PARTNER_REFUSE_MATCH_INVITATION, eventListenersMap[MATCH_PARTNER_REFUSE_MATCH_INVITATION]);
  }
}

export function subscribeMatchPartnerUnavailableEvent(cb) {
  const matchPartnerUnavailableEventListener= () => {
    cb();
  };
  socket.on(MATCH_PARTNER_UNAVAILABLE, matchPartnerUnavailableEventListener);

  eventListenersMap[MATCH_PARTNER_UNAVAILABLE] = matchPartnerUnavailableEventListener;
}

export function unsubscribeMatchPartnerUnavailableEvent() {
  if (eventListenersMap[MATCH_PARTNER_UNAVAILABLE]) {
    socket.off(MATCH_PARTNER_UNAVAILABLE, eventListenersMap[MATCH_PARTNER_UNAVAILABLE]);
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
  console.log('emit give up', combatRoomKey)
  socket.emit(USER_GIVE_UP, combatRoomKey, user);
}

export function emitUserSocketInitEvent(combatRoomKey, user) {
  console.log('init socket', user)
  socket.emit(USER_SOCKET_INIT, combatRoomKey, user);
}
