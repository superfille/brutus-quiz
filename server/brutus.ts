import { Server, Socket } from 'socket.io';
import { AnswerQuestion, ForAllGameResult, JoinRoom, MyResult, Player, Question } from './interfaces';

export default class Brutus {
  roomId: string = '123';
  players: Array<Player> = [];
  questions: Array<Question> = [];
  currentQuestionId: number = -1;

  isRoomId(roomId: string): boolean {
    return this.roomId === roomId;
  }

  gameResults():  Array<ForAllGameResult> {
    return this.players
      .sort((a, b) => this.countPoints(b) - this.countPoints(a))
      .map(player => {
      return {
        name: player.name,
        points: this.countPoints(player)
      };
    });
  }

  myResults(playerId: string): Array<MyResult> {
    const player = this.players.find(p => p.playerId === playerId)
    if (player === undefined) {
      return [];
    }

    return player.answers.map(answer => {
      return {
        question: '', // getQuestion(answer.questionId),
        answerId: answer.answerId,
        isCorrect: answer.isCorrect
      };
    })
  }

  countPoints(player: Player): number {
    return player.answers.filter(({ isCorrect }) => isCorrect).length
  }

  userAlreadyExists(name: string) {
    console.log(this.players)
    return this.players.some(player => player.name === name);
  }

  sendResultsToIndividuals(io: Server) {
    this.players.forEach(({ playerId }) => {
      io.to(playerId).emit('my results', this.myResults(playerId))
    });
  }

  createUser(name: string, socketId: string) {
    this.players.push({
      name,
      playerId: socketId,
      answers: [],
    })
  
    return socketId;
  }


  /// Questions
  getQuestion(questionId: number, withCorrectOption = false): Question | null {
    const question = this.questions.find(q => q.questionId === questionId)
    if (!question) {
      return null;
    }

    return {
      ...question,
      correctOptionId: withCorrectOption ? question.correctOptionId : '' // Remove so sneaky fe:ers dont see it in network
    }
  }

  getNextQuestion(): Question | null {
    if (this.currentQuestionId >= this.questions.length) {
      return null;
    }
    this.currentQuestionId += 1;
    return this.getQuestion(this.currentQuestionId);
  }

  isAnswerCorrect(answerId: string, questionId: number): boolean {
    const question = this.questions.find(q => q.questionId === questionId);

    return !!question && question.correctOptionId === answerId;
  }

  shouldGetNextQuestion(): boolean {
    const playersAnswered = this.players
      .filter(player => player.answers.some(answer => answer.questionId === this.currentQuestionId)).length;
    return playersAnswered === this.players.length
  }

  ////ROOM
  joinRoom(payload: JoinRoom, io: Server, socket: Socket) {
    if (payload.roomId === this.roomId) {
      if (this.userAlreadyExists(payload.name)) {
        socket.emit('joined room', {
          message: 'Name already exists'
        });
      } else {
        const playerId = this.createUser(payload.name, socket.id)
  
        socket.join(this.roomId)
        socket.emit('joined room', {
          message: 'Successfully joined room',
          playerId,
        });
        io.to(this.roomId).emit('player joined', `${payload.name} joined the room`);
      }
    } else {
      socket.emit('joined room', {
        message: 'Room does not exist'
      });
    }
  }

  setAnswer(payload: AnswerQuestion) {
    const player = this.players.find(p => p.playerId === payload.playerId)
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
        isCorrect: this.isAnswerCorrect(payload.answerId, payload.questionId)
      });
    }
  }
}
