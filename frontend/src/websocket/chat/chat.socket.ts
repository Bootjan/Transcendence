import { io } from "socket.io-client";

export const connect: () => any = () => {
  return io("http://" +  process.env.REACT_APP_BACKEND_HOST + "/chat");
}

export const listen: (socket: any, callbackFunc: (response: string) => void) => void = (socket, callbackFunc) => {
  socket.on('message', callbackFunc);
}

export const disconnect: (socket: any) => void = (socket) => {
  socket.disconnect();
}

export const joinRoom: (socket: any, room: string) => void = (socket, room) => {
  socket.emit("joinRoom", room);
}

export const leaveRoom: (socket: any, room: string) => void = (socket, room) => {
  socket.emit("leaveRoom", room);
}

export const send: (socket: any, message: {room: string, content: string}) => void = (socket, message) => {
  socket.emit("message", message);
}
