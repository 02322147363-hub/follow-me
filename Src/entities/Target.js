import Sprite from "./Sprite.js"

export default class Target extends Sprite {
    constructor(args) {
        super(args)
        this.facing = 1
    }

    follow(player, deltaTime) {
        const accel = 900
        const maxSpeed = 120
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
    }

    update(deltaTime, ctx, gravity, canvasWidth) {
        super.update(deltaTime, ctx, gravity, canvasWidth)
    }
}
