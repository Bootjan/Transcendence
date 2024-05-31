import React, { Context, createContext, useContext, useState } from 'react';
import { io } from 'socket.io-client'
import Match from './Match';
import { getUserById } from '../../api/user/user.api';
import cs from '../../css/game.module.css';

enum ConnectionState {
	JOINING_QUEUE,
	CREATING_CUSTOM,
	JOINING_CUSTOM,
	IN_QUEUE,
	MATCHED,
	IN_GAME,
	WON,
	LOST,
	OPPONENT_DISCONNECTED,
	DOUBLE_JOIN,
	MATCH_NOT_FOUND
}

type JoinType = "join_queue" | "join_custom" | "create_custom"

class Game extends React.Component<{user_id: number, join_type: JoinType, speed_mult: number, first_to: number, custom_id: number}> {
	socket = io("http://" + process.env.REACT_APP_BACKEND_HOST + "/game", {
		autoConnect: false,
	});

	user_id: number;
	speed_mult: number;
	first_to: number;
	custom_id: number;

	state : Readonly<{
		connection_state: ConnectionState
	}>

	constructor(props : {user_id: number, join_type: JoinType, speed_mult: number, first_to: number, custom_id: number}) {
		super(props)
		this.user_id = props.user_id;
		this.speed_mult = props.speed_mult
		this.first_to = props.first_to
		this.custom_id = props.custom_id
		this.state = {
			connection_state: ConnectionState.JOINING_QUEUE,
		}
		if (props.join_type == "join_custom")
		{
			this.state = {
				connection_state: ConnectionState.JOINING_CUSTOM,
			}
		}
		else if (props.join_type == "create_custom")
		{
			this.state = {
				connection_state: ConnectionState.CREATING_CUSTOM,
			}
		}
	}

	componentDidMount() {
		this.socket.connect()

		if (this.state.connection_state == ConnectionState.JOINING_QUEUE)
		{
			this.join_queue()
		}
		else if (this.state.connection_state == ConnectionState.JOINING_CUSTOM)
		{
			this.join_custom()
		}
		else if (this.state.connection_state == ConnectionState.CREATING_CUSTOM)
		{
			this.create_custom()
		}
	}
	componentWillUnmount() {
		this.socket.disconnect()
	}

	join_queue() {
		this.state = {
			...this.state,
			connection_state: ConnectionState.JOINING_QUEUE,
		}

		this.socket.once("queue_joined", () => {
			this.in_queue()
		})
		this.socket.emit("join_queue", this.user_id);
	}

	join_custom() {
		this.state = {
			...this.state,
			connection_state: ConnectionState.JOINING_CUSTOM,
		}

		this.socket.once("match_found", () => {
			this.matched()
		})
		this.socket.once("match_not_found", () => {
			this.match_not_found()
		})
		this.socket.emit("join_custom_match", this.user_id, this.custom_id);
	}

	create_custom() {
		this.state = {
			...this.state,
			connection_state: ConnectionState.JOINING_CUSTOM,
		}

		this.socket.once("match_created", () => {
			this.in_queue()
		})
		this.socket.emit("new_custom_match", this.user_id, this.first_to, this.speed_mult);
	}

	in_queue() {
		this.setState({
			...this.state,
			connection_state: ConnectionState.IN_QUEUE
		})
		this.socket.once("match_found", () => {
			this.socket.offAny()
			this.matched()
		})
		this.socket.once("double_join", () => {
			this.socket.offAny()
			this.double_join()
		})
	}

	matched() {
		this.setState({
			...this.state,
			connection_state: ConnectionState.MATCHED,
		})
		this.socket.once("opponent_disconnected", () => {
			this.socket.offAny()
			this.opponent_disconnected()
		})
		this.socket.once("you_win", () => {
			this.socket.offAny()
			this.won()
		})
		this.socket.once("you_lose", () => {
			this.socket.offAny()
			this.lost()
		})
	}

	won() {
		this.setState({
			...this.state,
			connection_state: ConnectionState.WON
		})
		this.socket.disconnect()
		this.socket.connect()
	}

	lost() {
		this.setState({
			...this.state,
			connection_state: ConnectionState.LOST
		})
		this.socket.disconnect()
		this.socket.connect()
	}

	opponent_disconnected() {
		this.setState({
			...this.state,
			connection_state: ConnectionState.OPPONENT_DISCONNECTED
		})
		this.socket.disconnect()
		this.socket.connect()
	}

	double_join() {
		this.setState({
			...this.state,
			connection_state: ConnectionState.DOUBLE_JOIN
		})
		this.socket.disconnect()
		this.socket.connect()
	}

	match_not_found() {
		this.setState({
			...this.state,
			connection_state: ConnectionState.MATCH_NOT_FOUND
		})
		this.socket.disconnect()
		this.socket.connect()
	}

	render() {
		if (this.state.connection_state == ConnectionState.JOINING_QUEUE) {
			return (
				<>
					<p>Joining the queue...</p>
				</>
			)
		}
		if (this.state.connection_state == ConnectionState.JOINING_CUSTOM) {
			return (
				<>
					<p>Joining match...</p>
				</>
			)
		}
		if (this.state.connection_state == ConnectionState.CREATING_CUSTOM) {
			return (
				<>
					<p>Creating custom match...</p>
				</>
			)
		}
		if (this.state.connection_state == ConnectionState.IN_QUEUE) {
			return (
				<>
					<p>Waiting for a match...</p>
				</>
			)
		}
		if (this.state.connection_state == ConnectionState.MATCHED) {
			return (
				<>
					<Match socket={this.socket}/>
				</>
			)
		}
		if (this.state.connection_state == ConnectionState.WON) {
			return (
				<>
					<p>Your won!</p>
				</>
			)
		}
		if (this.state.connection_state == ConnectionState.LOST) {
			return (
				<>
					<p>Your lost!</p>
				</>
			)
		}
		if (this.state.connection_state == ConnectionState.OPPONENT_DISCONNECTED) {
			return (
				<>
					<p>Your opponent disconnected!</p>
				</>
			)
		}
		if (this.state.connection_state == ConnectionState.DOUBLE_JOIN) {
			return (
				<>
					<p>You can't join the queue twice!</p>
				</>
			)
		}
		if (this.state.connection_state == ConnectionState.MATCH_NOT_FOUND) {
			return (
				<>
					<p>Couldn't find the match!</p>
				</>
			)
		}
		return (
			<>
				<p>What are you doing?!?</p>
			</>
		)
	}
}

export default Game