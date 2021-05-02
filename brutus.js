
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
    //     }
    //   ]
    // }
  ];

  let currentQuestionId = -1;
  const questions = [
    {
      questionId: 0,
      type: 'radio',
      question: 'Answer is 3',
      options: [
        {
          optionId: 1,
          value: '1',
        },
        {
          optionId: 2,
          value: '2',
        },
        {
          optionId: 3,
          value: '3',
        }
      ],
      correctAnswerId: 3, // optionId
    },
    {
      questionId: 1,
      type: 'radio',
      question: 'This is the second question',
      options: [
        {
          optionId: 1,
          value: '1',
        },
        {
          optionId: 2,
          value: '2',
        },
        {
          optionId: 3,
          value: '3',
        }
      ],
      correctAnswerId: 3, // optionId
    },
    {
      questionId: 2,
      type: 'radio',
      question: 'This is the third question',
      options: [
        {
          optionId: 1,
          value: '1',
        },
        {
          optionId: 2,
          value: '2',
        },
        {
          optionId: 3,
          value: '3',
        }
      ],
      correctAnswerId: 3, // optionId
    }
  ];
  
  const joinRoom = (payload, io, socket) => {
    if (payload.roomId === roomId) {
      if (userAlreadyExists(payload.name)) {
        socket.emit('joined room', {
          message: 'Name already exists'
        });
      } else {
        const playerId = createUser(payload.name)
  
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
  
  const createUser = (name) => {
    const playerId = name
      + Math.floor(Math.random() * 10000)
      + Math.floor(Math.random() * 10000)
  
    players.push({
      name,
      playerId,
      answers: [],
    })
  
    return playerId;
  }
  
  const getNextQuestion = () => {
    if (currentQuestionId >= questions.length) {
      console.log('No more questions')
      return undefined;
    }
    currentQuestionId += 1;
    const q = getQuestion(currentQuestionId)
    console.log(q, currentQuestionId);
    return q;
  }

  const getQuestion = (questionId) => {
    const question = questions.find(q => q.questionId === questionId)
    if (question) {
      return {
        ...question,
        correctAnswerId: undefined
      }
    }
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
      });
      console.log(player.answers);
    }
  }

  const shouldGetNextQuestion = () => {
    const playersAnswered = players.filter(player => player.answers.some(answer => answer.questionId === currentQuestionId)).length;
    return playersAnswered === players.length
  }

  const gameResult = () => {
    return {
      players
    };
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
  }
}