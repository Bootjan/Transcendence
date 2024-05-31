import React from "react"
import { Socket } from "socket.io-client"
import cs from '../../css/game.module.css';

class ScoreBoard extends React.Component<{socket: Socket}> {
	socket : Socket
	state : Readonly<{score: number, opponent_score: number}>
	score = 0;
	opponent_score = 0;
	
	constructor(props : {socket: Socket}) {
		super(props)
		this.socket = props.socket
		this.state = {
			score: 0,
			opponent_score: 0,
		}
	}
	
	componentDidMount() {
		this.socket.on("score", (score: number, opponent_score: number) => {
			this.setState({
				score: score,
				opponent_score: opponent_score,
			})
		})
	}
	componentWillUnmount() {
		this.socket.off("score")
	}
	
	render() {
		return (
			<>
				<p>Score: {this.state.score} | {this.state.opponent_score}</p>
			</>
		)
	}
}

export default ScoreBoard