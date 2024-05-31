class RelativeDrawingContext
{
	base_canvas_width: number
	base_canvas_height: number
	ctx: CanvasRenderingContext2D;

	constructor(base_canvas_width: number, base_canvas_height: number, ctx: CanvasRenderingContext2D)
	{
		this.base_canvas_width = base_canvas_width
		this.base_canvas_height = base_canvas_height
		this.ctx = ctx
	}
	
	scale() : number
	{
		let scale_x = this.ctx.canvas.width / this.base_canvas_width
		let scale_y = this.ctx.canvas.height / this.base_canvas_height
		if (scale_y < scale_x)
			return (scale_y)
		return (scale_x)
	}

	draw_circle(base_x: number, base_y: number, base_radius: number)
	{
		this.ctx.beginPath()
		this.ctx.arc(base_x * this.scale(), base_y * this.scale(), base_radius * this.scale(), 0, 2*Math.PI)
		this.ctx.fill()
	}

	draw_rectangle(base_x: number, base_y: number, base_width: number, base_height: number)
	{
		this.ctx.beginPath()
		this.ctx.rect(base_x * this.scale(), base_y * this.scale(), base_width * this.scale(), base_height * this.scale())
		this.ctx.fill()
	}
}

export default RelativeDrawingContext