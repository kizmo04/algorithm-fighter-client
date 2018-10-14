import io from 'socket.io-client';
import {
  SEND_MATCH_INVITATION,
  PENDING_MATCH_ACCEPTANCE,
  ACCEPT_MATCH_INVITATION,
  REFUSE_MATCH_INVITATION,
  MATCH_PARTNER_ENTERED,
  MATCH_PARTNER_UNAVAILABLE,
  MATCH_PARTNER_REFUSE_MATCH_INVITATION,
} from '../constants/socketEventTypes';
export const socket = io('http://localhost:5000');

socket.on(MATCH_PARTNER_ENTERED, ({hostUser, combatRoomKey, guestSocketId, hostSocketId, guestUser, participants}) => {
  // 안내 메세지 현재 두 클라이언트가 같은 room 에 join한 시점
  // 게임 시작
  if (guestUser) {
    console.log(`${guestUser.email} 님이 입장했습니다!!!! 현재 인원 ${participants}`);
  } else {
    console.log('전투실에 입장했습니다.');
  }
});

export function subscribePendingMatchAcceptanceEvent(cb) {
  socket.on(PENDING_MATCH_ACCEPTANCE, guestUser => {
    cb(guestUser);
  });
}

export function subscribeSendMatchInvitationEvent(cb) {
  console.log('subscribe send match invitation function start');
  socket.on(SEND_MATCH_INVITATION, ({ hostUser, combatRoomKey }) => {
    console.log('event on subscribe send match invitation function start');
    cb(hostUser, combatRoomKey);
  });
}

export function emitAcceptMatchInvitationEvent(cb, {combatRoomKey, guestUser}) {
  socket.emit(ACCEPT_MATCH_INVITATION, {combatRoomKey, guestUser});
  cb({combatRoomKey});
}

export function emitRefuseMatchInvitationEvent(cb, {combatRoomKey, guestUser}) {
  socket.emit(REFUSE_MATCH_INVITATION, {combatRoomKey, guestUser});
  cb({combatRoomKey});
}

export function subscribeMatchPartnerRefuseMatchInvitationEvent(cb) {
  socket.on(MATCH_PARTNER_REFUSE_MATCH_INVITATION, combatRoomKey => {
    cb(combatRoomKey);
  });
}

export function subscribeMatchPartnerUnavailableEvent(cb) {
  socket.on(MATCH_PARTNER_UNAVAILABLE, () => {
    cb();
  });
}
