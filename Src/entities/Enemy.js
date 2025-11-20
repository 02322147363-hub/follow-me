import Sprite from "./Sprite.js"

export default class Enemy extends Sprite {
    constructor(args) {
        super(args)
        this.facing = 1
        this.isDead = false
    }

    follow(player, deltaTime) {
        if (this.isDead) return

        const accel = 500
        const maxSpeed = 112
        const deccel = 0.95
        const range = 200
        
        const dx = player.position.x - this.position.x
        const distanceX = Math.abs(dx)

        if (distanceX > range) {
            this.velocity.x *= deccel
        } else {
            this.velocity.x += dx > 0 ? accel * deltaTime : -accel * deltaTime
        }

        if (this.velocity.x > maxSpeed) this.velocity.x = maxSpeed
        if (this.velocity.x < -maxSpeed) this.velocity.x = -maxSpeed

        this.facing = dx > 0 ? 1 : -1
    }

    update(deltaTime, ctx, gravity, canvasWidth) {
        
        if (this.isDead) {
            this.draw(ctx)
            return
        }


        super.update(deltaTime, ctx, gravity, canvasWidth)
    }
}
