import { Inject, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DisconnectReason, Socket } from "socket.io";
import { MatchesService } from "src/matches/matches.service";
import { Repository } from "typeorm";

// import { MatchDto } from '../matches/models/match.dto';
import { UserService } from "src/users/user.service";
import { User } from "src/users/models/user.entity";

class Player
{
	socket: Socket;
	id: number = -1;
	paddle_y: number = 50
	score: number = 0

	constructor (socket: Socket)
	{
		this.socket = socket;
	}
}

class Ball
{
	x: number
	y: number
	x_vel: number
	y_vel: number
	default_speed_mult: number
	speed_mult: number

	score_callback: Function

	constructor(speed_mult: number, score_callback: (player: number) => void) {
		this.default_speed_mult = speed_mult
		this.speed_mult = speed_mult
		this.reset(1)
		this.score_callback = score_callback
	}

	reset(dir: number) {
		this.x = 100
		this.y = 50
		this.x_vel = 45 * 2.5 * dir * this.speed_mult
		this.y_vel = 26 * 2.5 * this.speed_mult
	}

	update(delta_time: number, player_1_paddle_y: number, player_2_paddle_y: number) {
		this.x += this.x_vel * delta_time
		this.y += this.y_vel * delta_time
		if (this.y < 0)
		{
			this.y = -this.y
			this.y_vel = -this.y_vel
		}
		if (this.y >= 100)
		{
			this.y = -(this.y - 100) + 100
			this.y_vel = -this.y_vel
		}

		if (this.x < 0 + 5.5)
		{
			let paddle_dist = this.y - player_1_paddle_y
			let sign = 1;
			if (paddle_dist < 0)
			{
				sign = -1
				paddle_dist = -paddle_dist;
			}
			if (paddle_dist < 16.5)
			{
				this.speed_mult *= 1.015
				this.x_vel = (16 - (paddle_dist / 1.5)) * 3 * 4 * this.speed_mult
				this.y_vel = (paddle_dist / 1.5) * 3 * sign * 4 * this.speed_mult
				return ;
			}
		}
		if (this.x < 0)
		{
			this.speed_mult *= 0.5
			if (this.speed_mult < this.default_speed_mult)
				this.speed_mult = this.default_speed_mult
			this.score_callback(1)
			this.reset(1);
		}
		if (this.x > 200 - 5.5)
		{
			let paddle_dist = this.y - player_2_paddle_y
			let sign = 1;
			if (paddle_dist < 0)
			{
				sign = -1
				paddle_dist = -paddle_dist;
			}
			if (paddle_dist < 16.5)
			{
				this.speed_mult *= 1.015
				this.x_vel = -(16 - (paddle_dist / 1.5)) * 3 * 4 * this.speed_mult
				this.y_vel = (paddle_dist / 1.5) * 3 * sign * 4 * this.speed_mult
				return ;
			}
		}
		if (this.x > 200)
		{
			this.speed_mult *= 0.8
			if (this.speed_mult < this.default_speed_mult)
				this.speed_mult = this.default_speed_mult
			this.score_callback(2)
			this.reset(-1)
		}
	}
}

type MatchConfig = {is_custom: boolean, first_to: number, speed_mult: number}
const DEFAULT_MATCH : MatchConfig = {
	is_custom: false,
	first_to: 3,
	speed_mult: 1,
	//paddle size
}

class Match
{
	player1: Player;
	player2: Player;
	match_config: MatchConfig
	ball: Ball
	matchService: MatchesService
	userService: UserService

	constructor (matchService: MatchesService, userService: UserService, player1: Player, player2: Player, match_config: MatchConfig)
	{
		this.matchService = matchService
		this.userService = userService
		this.player1 = player1;
		this.player2 = player2;
		this.player1.paddle_y = 50
		this.player2.paddle_y = 50
		this.player1.score = 0
		this.player2.score = 0

		this.match_config = match_config

		this.ball = new Ball(match_config.speed_mult, (player) => {
			if (player == 1)
			{
				player2.score += 1
			}
			if (player == 2)
			{
				player1.score += 1
			}
			this.send_score_update()
		})
		
		player1.socket.emit("match_found", player2.id);
		player2.socket.emit("match_found", player1.id);
		
		const update = () => {
			this.ball.update(1/80, this.player1.paddle_y, this.player2.paddle_y)
			this.send_state_update()
			update_timeout = setTimeout(update, 1000/80)
		}
		let update_timeout = setTimeout(update, 1000/80);

		player1.socket.on("paddle_y", (paddle_y: number) => {
			player1.paddle_y = paddle_y
			this.send_state_update()
		});
		player2.socket.on("paddle_y", (paddle_y: number) => {
			player2.paddle_y = paddle_y
			this.send_state_update()
		});
		
		player1.socket.once("disconnect", (_reason: DisconnectReason) => {
			player2.socket.emit("opponent_disconnected");
			player2.socket.removeAllListeners("disconnect");
			player2.socket.removeAllListeners("paddle_y");
			clearTimeout(update_timeout);
		});
		player2.socket.once("disconnect", (_reason: DisconnectReason) => {
			player1.socket.emit("opponent_disconnected");
			player1.socket.removeAllListeners("disconnect");
			player1.socket.removeAllListeners("paddle_y");
			clearTimeout(update_timeout);
		});

		this.send_state_update()
		this.send_score_update()
	}

	send_state_update()
	{
		this.player1.socket.emit("state_update", {ball: {x: this.ball.x, y: this.ball.y}, paddle_y: this.player1.paddle_y, opponent_paddle_y: this.player2.paddle_y});
		this.player2.socket.emit("state_update", {ball: {x: 200-this.ball.x, y: this.ball.y}, paddle_y: this.player2.paddle_y, opponent_paddle_y: this.player1.paddle_y});
	}

	send_score_update()
	{
		this.player1.socket.emit("score", this.player1.score, this.player2.score);
		this.player2.socket.emit("score", this.player2.score, this.player1.score);
		if (this.player1.score >= this.match_config.first_to) {
			this.player1.socket.emit("you_win");
			this.player2.socket.emit("you_lose");
			this.matchService.addMatch({
				match_id: -1,
				id_player1: this.player1.id,
				id_player2: this.player2.id,
				score_player1: this.player1.score,
				score_player2: this.player2.score,
				is_custom_match: this.match_config.is_custom,
			})
			this.userService.addVictoryById(this.player1.id);
			this.userService.addLossById(this.player2.id);
		}
		if (this.player2.score >= this.match_config.first_to) {
			this.player2.socket.emit("you_win");
			this.player1.socket.emit("you_lose");
			this.matchService.addMatch({
				match_id: -1,
				id_player1: this.player1.id,
				id_player2: this.player2.id,
				score_player1: this.player1.score,
				score_player2: this.player2.score,
				is_custom_match: this.match_config.is_custom,
			})
			this.userService.addVictoryById(this.player2.id);
			this.userService.addLossById(this.player1.id);
		}
	}
}

type CustomMatchQueueItem = {player1: Player, config: MatchConfig}

class MatchMaker
{
	queued_player: Player | null = null;
	matchService: MatchesService
	userService: UserService

	custom_match_queue: CustomMatchQueueItem[] = []

	constructor(matchService: MatchesService, userService: UserService) {
		this.matchService = matchService
		this.userService = userService
	}

	join_queue(player: Player)
	{
		player.socket.emit("queue_joined");
		if (this.queued_player == null)
		{
			this.queued_player = player;
			player.socket.once("disconnect", (_reason: DisconnectReason) => {
				this.leave_queue(player)
			});
		}
		else
		{
			if (this.queued_player.id == player.id) {
				player.socket.emit("double_join");
			} else {
				this.queued_player.socket.removeAllListeners("disconnect");
				this.match_players(this.queued_player, player, DEFAULT_MATCH);
				this.queued_player = null;
			}
		}
	}

	leave_queue(player: Player)
	{
		if (this.queued_player == player)
			this.queued_player = null;
	}

	match_players(player1: Player, player2: Player, config: MatchConfig)
	{
		new Match(this.matchService, this.userService, player1, player2, config);
	}

	new_custom(player1: Player, first_to: number, speed_mult: number)
	{
		this.custom_match_queue = this.custom_match_queue.filter((custom_match: CustomMatchQueueItem) => {
			return (custom_match.player1.id != player1.id);
		})
		this.custom_match_queue.push({player1: player1, config: {is_custom: true, first_to: first_to, speed_mult: speed_mult}});
		player1.socket.once("disconnect", (_reason: DisconnectReason) => {
			this.custom_match_queue = this.custom_match_queue.filter((custom_match: CustomMatchQueueItem) => {
				return (custom_match.player1.id != player1.id);
			})
		});
		player1.socket.emit("match_created", player1.id);
	}

	join_custom(player2: Player, match_creator_id: number) {
		let found_match = this.custom_match_queue.find((custom_match: CustomMatchQueueItem) => {
			return (custom_match.player1.id == match_creator_id);
		})
		if (found_match == undefined) {
			player2.socket.emit("match_not_found");
		}
		else {
			found_match.player1.socket.removeAllListeners("disconnect");
			this.match_players(found_match.player1, player2, found_match.config);
			this.custom_match_queue.splice(this.custom_match_queue.indexOf(found_match));
		}
	}
}

@Injectable()
class GameService
{
	match_maker: MatchMaker;

	constructor(private matchService: MatchesService, @InjectRepository(Match) private matchRepository: Repository<Match>,
				private userService: UserService, @InjectRepository(User) private userRepository: Repository<User>) {
		this.match_maker = new MatchMaker(matchService, userService);
	}

	handleConnection(socket: Socket)
	{
		const player = new Player(socket);

		player.socket.once("join_queue", (player_id: number) => {
			player.socket.removeAllListeners("new_custom_match");
			player.socket.removeAllListeners("join_custom_match");
			player.id = player_id;
			this.match_maker.join_queue(player);
		});

		player.socket.once("new_custom_match", (player_id: number, first_to: number, speed_mult) => {
			player.socket.removeAllListeners("join_queue");
			player.socket.removeAllListeners("join_custom_match");
			player.id = player_id;
			this.match_maker.new_custom(player, first_to, speed_mult);
		})

		player.socket.once("join_custom_match", (player_id: number, match_creator_id: number) => {
			player.socket.removeAllListeners("join_queue");
			player.socket.removeAllListeners("new_custom_match");
			player.id = player_id;
			this.match_maker.join_custom(player, match_creator_id);
		})
	}
}

export default GameService