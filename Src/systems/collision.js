export function checkCollision(obj, platform, deltaTime) {

    const nextX = obj.position.x + obj.velocity.x * deltaTime
    const nextY = obj.position.y + obj.velocity.y * deltaTime

    if (
        obj.position.y + obj.height <= platform.position.y &&
        nextY + obj.height >= platform.position.y &&
        obj.position.x + obj.width >= platform.position.x &&
        obj.position.x <= platform.position.x + platform.width
    ) {
            obj.velocity.y = 0
            obj.isOnGround = true
            obj.position.y = platform.position.y - obj.height
    }

    if (
        obj.position.y >= platform.position.y + platform.height &&
        nextY <= platform.position.y + platform.height &&
        obj.position.x + obj.width >= platform.position.x &&
        obj.position.x <= platform.position.x + platform.width &&
        obj.velocity.y < 0
    ) {
        obj.velocity.y = 0
        obj.position.y = platform.position.y + platform.height
    }

    const overlapY = obj.position.y + obj.height > platform.position.y && obj.position.y < platform.position.y + platform.height

    if (
        overlapY &&
        obj.position.x + obj.width <= platform.position.x &&
        nextX + obj.width >= platform.position.x
    ) {
        obj.velocity.x = 0
        obj.position.x = platform.position.x - obj.width
    }

    if (
        overlapY &&
        obj.position.x >= platform.position.x + platform.width &&
        nextX <= platform.position.x + platform.width
    ) {
        obj.velocity.x = 0
        obj.position.x = platform.position.x + platform.width
    }
}