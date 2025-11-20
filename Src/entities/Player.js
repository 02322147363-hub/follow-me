import Sprite from "./Sprite.js"

export default class Player extends Sprite {
    constructor(args) {
        super(args)
        this.facing = 1
        this.isOnGround = true
    }

    handleInput(keys, deltaTime) {
        const accel = 600
        const maxSpeed = 300
        const deccel = 0.93

        // Player movement
        if (keys.a.pressed && keys.d.pressed) {
            this.velocity.x *= deccel
        } else if (keys.arrowLeft.pressed && keys.arrowRight.pressed) {
            this.velocity.x *= deccel
        } else if (keys.arrowLeft.pressed && keys.d.pressed) {
            this.velocity.x *= deccel
        } else if (keys.arrowRight.pressed && keys.a.pressed) {
            this.velocity.x *= deccel
        } else if (keys.a.pressed || keys.arrowLeft.pressed) {
            this.velocity.x -= accel * deltaTime
        } else if (keys.d.pressed || keys.arrowRight.pressed) {
            this.velocity.x += accel * deltaTime
        } else {
            this.velocity.x *= deccel
        }

        if (this.velocity.x > maxSpeed) this.velocity.x = maxSpeed
        if (this.velocity.x < -maxSpeed) this.velocity.x = -maxSpeed

        if (keys.arrowRight.pressed || keys.d.pressed) this.facing = 1
        if (keys.arrowLeft.pressed || keys.a.pressed) this.facing = -1
    }

    handleJump() {
        if (this.isOnGround) {
            this.velocity.y = -600 // jumpForce
            this.isOnGround = false
        }
    }

    update(deltaTime, ctx, gravity, canvasWidth) {
        // super.update = posisi + gravitasi + batas kiri-kanan
        super.update(deltaTime, ctx, gravity, canvasWidth)
    }
}