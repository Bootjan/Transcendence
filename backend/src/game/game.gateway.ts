import { Inject, Logger } from "@nestjs/common";
import { MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from "@nestjs/websockets";
import { Socket } from "socket.io";
import GameService from "./game.service";

@WebSocketGateway({ cors: true, namespace: "game" })
class GameGateway implements OnGatewayConnection
{
	@WebSocketServer()
	private server: Socket;

	constructor(private readonly socketService: GameService) {}

	handleConnection(socket: Socket) {
		this.socketService.handleConnection(socket);
	}
}

export default GameGateway