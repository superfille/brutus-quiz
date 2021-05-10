import { Socket } from "socket.io-client";

import { JoinRoomInformation } from "@/interfaces/interfaces";
import { SocketActions } from "./socket-enums";

export const joinRoomAction = (socket: Socket, joinRoomInfo: JoinRoomInformation) => {
  socket.emit(SocketActions.JOINROOM, joinRoomInfo);
}

export const startGameAction = (socket: Socket, roomId: string) => {
  socket.emit(SocketActions.STARTGAME, roomId);
}