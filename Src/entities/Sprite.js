export default class Sprite {
    constructor({width, height, position, velocity, color}) {
        this.width = width
        this.height = height
        this.position = position
        this.velocity = velocity
        this.color = color
    }

    draw(ctx) {
        ctx.fillStyle = this.color
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    update(deltaTime, ctx, gravity, canvasWidth) {
        this.draw(ctx)

        this.position.x += this.velocity.x * deltaTime
        this.position.y += this.velocity.y * deltaTime
        this.velocity.y += gravity * deltaTime

        if (this.position.x < 0) {
            this.position.x = 0
            this.velocity.x = 0
        }

        if (this.position.x + this.width > canvasWidth) {
            this.position.x = canvasWidth - this.width
            this.velocity.x = 0
        }
    }
}