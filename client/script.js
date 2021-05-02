var socket = io({ autoConnect: false });



socket.on('question', (question) => {
  console.log(question)
})

socket.on('player joined', (payload) => {
  console.log(payload);
})

socket.on('joined room', (payload) => {
  console.log(payload);
})

socket.on('game over', (payload) => {
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
  socket.connect();

  socket.emit('start game');
});