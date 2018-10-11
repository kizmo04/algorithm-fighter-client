import io from 'socket.io-client';
export const socket = io('http://localhost:5000');


socket.on('requst user info', ({ hostSocketId, hostUser, combatRoomKey }) => {
  // hostUser의 요청에 따라 게스트들의 유저 정보를 보냄.
  console.log(`client request user info, ${hostUser.email} find someone`, hostSocketId);
  socket.emit('response user info', {
    hostSocketId,
    hostUser,
    combatRoomKey,
    guestSocketId: socket.id
  })
});
// socket.on('join waiting room', msg => {
//   console.log(msg);
// });

// socket.on('waiting for player', () => {
//   // 모달에 안내메세지, 스피너
//   console.log('상대방을 찾고있습니다.')
// });

// socket.on('will you join combat match', user => {
//   // 수락 버튼 모달 띄우기
//   //
//   console.log('combat : ' + user);
// });

socket.on('join guest', (guestUser, participants) => {
  // 안내 메세지 현재 두 클라이언트가 같은 room 에 join한 시점
  // 게임 시작
  // 매칭이 되면 room 말고 namespace를 바꿀 것.. 탐색에 안걸리고 메세지도 안 가도록.
  console.log(`${guestUser.email} 님이 입장했습니다!!!! 현재 인원 ${participants}`)
});

socket.on('waiting for guest to accept', guestUser => {
  // 상대를 찾은 시점, 모달에 안내메세지 띄우기, 스피너
  console.log(`${guestUser.email}님의 수락을 기다리는 중입니다.`)
});

socket.on('will you join?', ({ hostUser, combatRoomKey, guestUser, guestSocketId }) => {
  // 모달에 상대 유저 정보와 전투 수락 버튼 띄워주기
  console.log(`${hostUser.email} 님과 전투를 수락하겠습니까??`)
  // 전투 수락버튼 누를 경우
  socket.emit('accept combat', {combatRoomKey, guestUser, guestSocketId});
  // 전투 거절할 경우
  // socket.emit('reject')
  // in server - hostUser에게 통보, host는 재탐색
});

socket.on('finding guest failure', () => {
  // 상태 메세지 (redux state modal message) 변경 - '상대방을 찾는 데 실패했습니다'
  // modal falg 변경 - 다시찾기 버튼 보여주기
  // 다시 찾기를 누르면 findingMatch 를 실행
});
