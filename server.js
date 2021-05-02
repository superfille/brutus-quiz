const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server);

const Brutus = require('./brutus.js').brutus();

const port = 8080

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/client/index.html')
});

app.get('/script', (req, res) => {
  res.sendFile(__dirname + '/client/script.js')
});

server.listen(port, () => {
  console.log('Listening to port', port);
});

io.on('connection', (socket) => {
  socket.on('join room', (payload) => {
    if (payload.roomId === Brutus.roomId) {
      if (Brutus.userAlreadyExists(payload.name)) {
        socket.emit('user already exists', payload.name)
        return;
      }
      Brutus.joinRoom(payload, io, socket)
    } else {
      console.log("Could not join room");
    }
  })

  socket.on('start game', () => {
    const question = Brutus.getNextQuestion();

    if (question === undefined) {
      io.to(Brutus.roomId).emit('game over', Brutus.gameResult());
    } else {
      io.to(Brutus.roomId).emit('question', question);
    }
  });

  socket.on('answer', (payload) => {
    Brutus.setAnswer(payload)

    if (Brutus.shouldGetNextQuestion()) {
      const question = Brutus.getNextQuestion();

      if (question === undefined) {
        io.to(Brutus.roomId).emit('game over', Brutus.gameResult());
      } else {
        io.to(Brutus.roomId).emit('question', question);
      }
    }
  })
});

