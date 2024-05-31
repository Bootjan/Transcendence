import { useEffect, useRef } from "react";
import RelativeDrawingContext from "./RelativeDrawingContext";
import React from "react";
import { Socket } from "socket.io-client";

class GameCanvas extends React.Component<{socket: Socket}> {
  socket : Socket
  canvas_ref : React.MutableRefObject<null>
	state : Readonly<{}>
  animationFrameId : number = 0
	
	constructor(props : {socket: Socket}) {
		super(props)
		this.socket = props.socket
		this.state = {
		}
    this.canvas_ref = React.createRef()
    
	}

  componentDidMount() {
    const canvas : HTMLCanvasElement = this.canvas_ref.current!
    const context : CanvasRenderingContext2D = canvas.getContext('2d')!
    let rdc = new RelativeDrawingContext(200, 100, context);

    const draw = (state: {ball: {x: number, y: number}, paddle_y: number, opponent_paddle_y: number}) => {
      context.fillStyle = '#FF0000'
      context.fillRect(0, 0, context.canvas.width, context.canvas.height)
      context.fillStyle = '#000000'
      rdc.draw_rectangle(0, 0, 200, 100);
      context.fillStyle = '#FFFFFF'
      rdc.draw_circle(state.ball.x, state.ball.y, 2);
      rdc.draw_rectangle(3 - 1.5, state.paddle_y - 15, 3, 30);
      rdc.draw_rectangle(200 - 3 - 1.5, state.opponent_paddle_y - 15, 3, 30);
    }

    this.socket.on("state_update", (state: {ball: {x: number, y: number}, paddle_y: number, opponent_paddle_y: number}) => {
      this.animationFrameId = window.requestAnimationFrame(() => {draw(state);})
    })

    this.animationFrameId = window.requestAnimationFrame(() => {
      draw({ball: {x: 100, y: 50}, paddle_y: 50, opponent_paddle_y: 50});
    });

    const mouse_move = (event: MouseEvent) => {
      var rect = canvas.getBoundingClientRect();
      
      this.socket.emit("paddle_y", (event.clientY - rect.top)/rdc.scale());
    }

    canvas.onmousemove = mouse_move;
	}

	componentWillUnmount() {
    window.cancelAnimationFrame(this.animationFrameId)
    this.socket.off("state_update")
	}
	
	render() {
		return (
			<>
				<canvas ref={this.canvas_ref} width={1000} height={500} style={{outline: "white 1px solid"}}></canvas>
			</>
		)
	}
}

export default GameCanvas;