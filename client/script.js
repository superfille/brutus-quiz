var socket = io({ autoConnect: false });

let currentQuestion;
let playerId;

socket.on('question', (question) => {
  currentQuestion = question;
  console.log(question)
})

socket.on('player joined', (payload) => {
  console.log(payload);
})

socket.on('joined room', (payload) => {
  playerId = payload.playerId;
  console.log(payload.message)
})

socket.on('game over all results', (payload) => {
  console.log(payload);
})

socket.on('my results', (payload) => {
  console.log('My results', payload)
})

socket.on('user already exists', (payload) => {
  console.log(payload);
})

document.getElementById('joinRoomBtn').addEventListener('click', () => {
  socket.connect();
  
  socket.emit('join room', {
    roomId: '123',
    name: document.getElementById('name').value,
  });
});

document.getElementById('startGameBtn').addEventListener('click', () => {
  socket.emit('start game');
});

document.getElementById('answerBtn').addEventListener('click', () => {
  socket.emit('answer', {
    questionId: currentQuestion.questionId,
    answerId: Math.random() < 0.5 ? 3 : 1,
    playerId,
  });
});