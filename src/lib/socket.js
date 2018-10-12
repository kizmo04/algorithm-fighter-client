import io from 'socket.io-client';
import {
  USER_LOGIN,
  USER_LOGOUT,
  REFUSE,
  JOIN_OPPONENT,
  ACCEPTANCE,
  NO_OPPONENT,
  WAITING_TO_ACCEPT,
  INVITE,
  REQUEST_OPPONENT,
} from '../constants/socketEventTypes';
export const socket = io('http://localhost:5000');


socket.on(JOIN_OPPONENT, ({hostUser, combatRoomKey, guestSocketId, hostSocketId, guestUser, participants}) => {
  // 안내 메세지 현재 두 클라이언트가 같은 room 에 join한 시점
  // 게임 시작
  // console.log(`in join guest : ${guestUser}`)
  if (guestUser) {
    console.log(`${guestUser.email} 님이 입장했습니다!!!! 현재 인원 ${participants}`);
  } else {
    console.log('전투실에 입장했습니다.');
  }
});

export function subscribeWaitingToAccept(cb) {
  socket.on(WAITING_TO_ACCEPT, ({guestUser}) => {
    cb(guestUser);
  });
}

export function subscribeInvite (cb) {
  socket.on(INVITE, ({ hostUser, combatRoomKey }) => {
    cb(hostUser, combatRoomKey);
  });
}

export function emitAcceptance(cb, {combatRoomKey, guestUser}) {
  socket.emit(ACCEPTANCE, {combatRoomKey, guestUser});
  cb({combatRoomKey});
}

export function emitRefuse(cb, {combatRoomKey, guestUser}) {
  socket.emit(REFUSE, {combatRoomKey, guestUser});
  cb({combatRoomKey});
}

export function subscribeRefuse(cb) {
  socket.on(REFUSE, combatRoomKey => {
    cb(combatRoomKey);
  });
}

export function subscribeNoOpponent(cb) {
  socket.on(NO_OPPONENT, () => {
    cb();
  });
}
