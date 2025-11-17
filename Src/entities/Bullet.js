export default class Bullet {
    constructor(x, y, direction) {
        this.width = 10
        this.height = 5
        this.speed = 500

        this.position = { x, y }
        this.velocity = { x: this.speed * direction, y: 0 }

        this.active = true
    }

    update(deltaTime, canvasWidth) {
        this.position.x += this.velocity.x * deltaTime

        // Deactivate bullet kalau keluar layar
        if (this.position.x < 0 || this.position.x > canvasWidth) {
            this.active = false
        }
    }

    draw(ctx) {
        ctx.fillStyle = "yellow"
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}
