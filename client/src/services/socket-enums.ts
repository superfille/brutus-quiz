import { Socket } from "socket.io-client"

export enum SocketActions {
  JOINROOM = 'join room',
  STARTGAME = 'start game',
}

export enum SocketSubscriptions {
  JOINEDROOM = 'joined room',
  NEXTQUESTION = 'next question',
}