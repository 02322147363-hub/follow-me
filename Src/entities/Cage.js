export default class Cage {
    constructor({position, width, height}) {
        this.position = position
        this.width = width
        this.height = height
    }

    draw(ctx) {
        ctx.strokeStyle = "#FF007F"
        ctx.lineWidth = 4
        ctx.strokeRect(this.position.x, this.position.y, this.width, this.height)
    }
}