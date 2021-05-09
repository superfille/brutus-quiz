
export interface Answers {
  questionId: number;
  answerId: string;
  isCorrect: boolean;
}

export interface Player {
  name: string;
  playerId: string;
  answers: Array<Answers>;
}

export interface ForAllGameResult {
  name: string,
  points: number,
}

export interface MyResult {
  question: string;
  answerId: string;
  isCorrect: boolean;
}

export interface Question {
  questionId: number;
  type: 'radio' | 'checkbox';
  question: string;
  options: Array<Option>;
  correctOptionId: string;
}

export interface Option {
  optionId: string;
  value: string;
}

export interface JoinRoomInformation {
  roomId: string;
  name: string;
}

export interface JoinedRoomInformation {
  status: 200 | 500;
  message: string;
  roomId?: string;
  playerId?: string;
}

export interface AnswerQuestion {
  playerId: string;
  questionId: number;
  answerId: string;
}