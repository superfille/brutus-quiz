
exports.brutus = (io) => {
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

  let currentQuestion = 50;
  const questions = [
    {
      id: 0,
      type: 'radio',
      question: 'Answer is 3',
      options: [
        {
          id: 1,
          value: '1',
        },
        {
          id: 2,
          value: '2',
        },
        {
          id: 3,
          value: '3',
        }
      ],
      correctAnswer: 3, // optionId
    },
    {
      id: 1,
      type: 'radio',
      question: 'This is the second question',
      options: [
        {
          id: 1,
          value: '1',
        },
        {
          id: 2,
          value: '2',
        },
        {
          id: 3,
          value: '3',
        }
      ],
      correctAnswer: 3, // optionId
    },
    {
      id: 2,
      type: 'radio',
      question: 'This is the third question',
      options: [
        {
          id: 1,
          value: '1',
        },
        {
          id: 2,
          value: '2',
        },
        {
          id: 3,
          value: '3',
        }
      ],
      correctAnswer: 3, // optionId
    }
  ];
  
  const joinRoom = (payload, socket) => {
    if (payload.roomId === roomId) {
      if (userAlreadyExists(payload.name)) {
        socket.emit('joined room', {
          message: 'Name already exists'
        });
      } else {
        const playerId = createUser(payload.name)
  
        socket.join(roomId)
        socket.emit('joined room', {
          message: 'Successfully joined room'
        });
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
      + Math.floor(Math.random() * 10000)
  
    brutusRoom.players.push({
      name,
      playerId: playerId
    })
  
    return playerId;
  }
  
  const getNextQuestion = () => {
    currentQuestion += 1;
    if (currentQuestion >= questions.length) {
      console.log('No more questions')
      return undefined;
    }

    return getQuestion(currentQuestion)
  }

  const getQuestion = (questionId) => {
    const question = questions.find(q => q.id === questionId)
    if (question) {
      return {
        ...question,
        correctAnswer: undefined
      }
    }
  }

  const gameResult = () => {
    return {
      result: 'Filip wins'
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
  }
}