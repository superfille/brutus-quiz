import { JoinedRoomInformation, Question } from "@/interfaces/interfaces";
import { Socket } from "socket.io-client";
import { SocketSubscriptions } from "./socket-enums";


export const joinedRoomSubscription = (socket: Socket, func: (info: JoinedRoomInformation) => void) => {
  socket.on(SocketSubscriptions.JOINEDROOM, func);
}

export const joinedRoomUnsubscribe = (socket: Socket) => {
  socket.off(SocketSubscriptions.JOINEDROOM);
}

export const nextQuestion = (socket: Socket, func: (question: Question) => void) => {
  socket.on(SocketSubscriptions.NEXTQUESTION, func);
}