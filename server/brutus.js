
exports.brutus = () => {
  const roomId = '123'
  const players = [
    // {
    //   name: 'Filip',
    //   playerId: '321',
    //   answers: [
    //     {
    //       questionId: '1',
    //       answerId: '',
    //       isCorrect: false
    //     }
    //   ]
    // }
  ];

  const gameResult = () => {
    return players
      .sort((a, b) => countPoints(b) - countPoints(a))
      .map(player => {
        return {
          name: player.name,
          points: countPoints(player)
        };
      });
  }

  const sendResultsToIndividuals = (io) => {
    players.forEach(({ playerId }) => {
      io.to(playerId).emit('my results', personalResult(playerId))
    })
  }

  const personalResult = (playerId) => {
    const player = players.find(p => p.playerId === playerId)
    if (player === undefined) {
      return undefined
    }

    return player.answers.map(answer => {
      return {
        question: getQuestion(answer.questionId),
        answerId: answer.answerId,
        isCorrect: answer.isCorrect
      };
    })
  }

  const countPoints = (player) => {
    return player.answers.filter(({ isCorrect }) => isCorrect).length
  }

  let currentQuestionId = -1;
  const questions = require('./questions.json');
  
  const joinRoom = (payload, io, socket) => {
    if (payload.roomId === roomId) {
      if (userAlreadyExists(payload.name)) {
        socket.emit('joined room', {
          message: 'Name already exists'
        });
      } else {
        const playerId = createUser(payload.name, socket.id)
  
        socket.join(roomId)
        socket.emit('joined room', {
          message: 'Successfully joined room',
          playerId,
        });
        io.to(roomId).emit('player joined', `${payload.name} joined the room`);
      }
    } else {
      socket.emit('joined room', {
        message: 'Room does not exist'
      });
    }
  }
  
  const userAlreadyExists = (name) => {
    return players.some(player => player.name === name)
  }
  
  const createUser = (name, socketId) => {
    // const playerId = name
    //   + Math.floor(Math.random() * 10000)
    //   + Math.floor(Math.random() * 10000)
  
    players.push({
      name,
      playerId: socketId,
      answers: [],
    })
  
    return socketId;
  }
  
  const getNextQuestion = () => {
    if (currentQuestionId >= questions.length) {
      return undefined;
    }
    currentQuestionId += 1;
    return getQuestion(currentQuestionId);
  }

  const getQuestion = (questionId, withCorrectOption = false) => {
    const question = questions.find(q => q.questionId === questionId)
    if (question) {
      return {
        ...question,
        correctOptionId: withCorrectOption ? question.correctOptionId : undefined // Remove so sneaky fe:ers dont see it in network
      }
    }
  }

  const isAnswerCorrect = (answerId, questionId) => {
    const question = questions.find(q => q.questionId === questionId);

    return question && question.correctOptionId === answerId;
  }

  const setAnswer = (payload) => {
    const player = players.find(p => p.playerId === payload.playerId)
    if (player === undefined) {
      return undefined;
    }

    const answer = player.answers.find(a => a.questionId === payload.questionId)
    if (answer) {
      answer.answerId = payload.answerId
    } else {
      player.answers.push({
        questionId: payload.questionId,
        answerId: payload.answerId,
        isCorrect: isAnswerCorrect(payload.answerId, payload.questionId)
      });
    }
  }

  const shouldGetNextQuestion = () => {
    const playersAnswered = players.filter(player => player.answers.some(answer => answer.questionId === currentQuestionId)).length;
    return playersAnswered === players.length
  }

  return {
    roomId,
    joinRoom,
    userAlreadyExists,
    createUser,
    getQuestion,
    getNextQuestion,
    gameResult,
    setAnswer,
    shouldGetNextQuestion,
    personalResult,
    sendResultsToIndividuals,
  }
}