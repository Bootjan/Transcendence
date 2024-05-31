import React from "react"
import { Socket } from "socket.io-client"
import ScoreBoard from "./ScoreBoard"
import GameCanvas from "./GameCanvas"

class Match extends React.Component<{socket: Socket}> {
	socket : Socket
	state : Readonly<{}>
	
	constructor(props : {socket: Socket}) {
		super(props)
		this.socket = props.socket
		this.state = {
		}
	}
	
	componentDidMount() {
	}
	componentWillUnmount() {
	}
	
	render() {
		return (
			<>
				<ScoreBoard socket={this.socket}/>
				<GameCanvas socket={this.socket}/>
			</>
		)
	}
}

export default Match