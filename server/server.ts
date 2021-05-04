import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import Brutus from './brutus'

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const port = 8080

const brutus = new Brutus();

// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/client/index.html')
// });

// app.get('/script', (req, res) => {
//   res.sendFile(__dirname + '/client/script.js')
// });

server.listen(port, () => {
  console.log('Listening to port', port);
});

app.get('/', (_, res) => {
  res.send('Hello typescript')
})

io.on('connection', (socket) => {
  socket.on('join room', (payload) => {
    if (brutus.isRoomId(payload.roomId)) {
      if (brutus.userAlreadyExists(payload.name)) {
        socket.emit('user already exists', payload.name)
        return;
      }
      brutus.joinRoom(payload, io, socket)
    } else {
      console.log("Could not join room");
    }
  })

  socket.on('start game', () => {
    const question = brutus.getNextQuestion();

    if (question === undefined) {
      io.to(brutus.roomId).emit('game over', brutus.gameResults());
    } else {
      io.to(brutus.roomId).emit('question', question);
    }
  });

  socket.on('answer', (payload) => {
    brutus.setAnswer(payload)

    if (brutus.shouldGetNextQuestion()) {
      const question = brutus.getNextQuestion();

      if (question === undefined) {
        io.to(brutus.roomId).emit('game over all results', brutus.gameResults());
        brutus.sendResultsToIndividuals(io)
      } else {
        io.to(brutus.roomId).emit('question', question);
      }
    }
  })
});

