import Sprite from "./entities/Sprite.js"
import Player from "./entities/Player.js"
import Enemy from "./entities/Enemy.js"
import Target from "./entities/Target.js"
import Bullet from "./entities/Bullet.js"
import Cage from "./entities/Cage.js"
import Platform from "./entities/Platform.js"

const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

const gravity = 1200
const jumpForce = -600

c.fillRect(0, 0, canvas.width, canvas.height)

const uiWin = document.getElementById("winScreen")
uiWin.style.width = canvas.width + "px"
uiWin.style.height = canvas.height + "px"
uiWin.style.display = "none"

const uiEnd = document.getElementById("endScreen")
uiEnd.style.display = "none"
uiEnd.style.width = canvas.width + "px"
uiEnd.style.height = canvas.height + "px"

const uiLose = document.getElementById("loseScreen")
uiLose.style.width = canvas.width + "px"
uiLose.style.height = canvas.height + "px"
uiLose.style.display = "none"

let player, target, cage, platforms = [], enemies = [], bullets = []

const charWidth = 20
const charHeight = 50
const cageVertices = 75
const groundHeight = 50

const levels = [
    {
        // level 0 start -------------------------
        player: {
            x: 50,
            y: canvas.height - charHeight - groundHeight
        },
        target: {
            x: 760,
            y: canvas.height - charHeight - groundHeight
        },
        cage: {
            x: 120,
            y: canvas.height - cageVertices - groundHeight
        },
        platforms: [
            {
                x: 0, y: canvas.height - groundHeight, width: canvas.width, height: groundHeight
            }
        ],
        enemies: []
        // level 0 end -------------------------
    }, {
        // level 1 start -----------------------
        player: {
            x: 50,
            y: canvas.height - charHeight - groundHeight
        },
        target: {
            x: 860,
            y: canvas.height - charHeight - groundHeight
        },
        cage: {
            x: 120,
            y: canvas.height - cageVertices - groundHeight
        },
        platforms: [
            {
                x: 0, y: canvas.height - groundHeight, width: canvas.width, height: groundHeight
            }, {
                x: canvas.width - 600, y: 375, width: 600, height: 20
            }
        ],
        enemies: [
            {
                x: 860,
                platformIndex: 1
            }
        ]
        // level 1 end -----------------------
    }
]

function loadLevel(index) {
    const data = levels[index]
    // console.log("loading level", index, data)

    player = new Player({
        width: charWidth,
        height: charHeight,
        position: {
            x: data.player.x,
            y: data.player.y
        },
        velocity: {
            x: 0,
            y: 0
        },
        color: "blue"
    })

    target = new Target({
        width: charWidth,
        height: charHeight,
        position: {
            x: data.target.x,
            y: data.target.y
        },
        velocity: {
            x: 0,
            y: 0
        },
        color: "pink"
    })

    cage = new Cage({
        position: {
            x: data.cage.x,
            y: data.cage.y
        },
        width: cageVertices,
        height: cageVertices
    })

    platforms = data.platforms.map(p => new Platform({
        x: p.x,
        y: p.y,
        width: p.width,
        height: p.height
    }))

    enemies = (data.enemies || []).map(e => {

        let spawnY = null

        if (typeof e.y === 'number') {
            spawnY = e.y
        } else if (typeof e.platformIndex === 'number') {
            const pi = e.platformIndex
            if (platforms[pi]) {
                spawnY = platforms[pi].position.y - charHeight
            }
        } else {
            const pUnder = platforms.find(
                p => e.x >= p.position.x && e.x <= p.position.x + p.width
            )
            if (pUnder) spawnY = pUnder.position.y - charHeight
            else spawnY = canvas.height - groundHeight - charHeight
        }

        const enemy = new Enemy({
            width: charWidth,
            height: charHeight,
            position: {
                x: e.x,
                y: spawnY
            },
            velocity: {
                x: 0,
                y: 0
            },
            color: "red"
        })

        return enemy
    })
}

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false
    },
    arrowLeft: {
        pressed: false
    },
    arrowRight: {
        pressed: false
    }
}

function checkCollision(obj, platform, deltaTime) {

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

let lastTime = 0
let animationId
lastTime = performance.now()

function animate(time = 0) {
    let deltaTime = (time - lastTime) / 1000
    if (deltaTime > 0.1) deltaTime = 0.1
    lastTime = time

    animationId = window.requestAnimationFrame(animate)

    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)

    player.isOnGround = false
    player.handleInput(keys, deltaTime)
    player.update(deltaTime, c, gravity, canvas.width)

    target.follow(player, deltaTime)
    target.update(deltaTime, c, gravity, canvas.width)

    enemies.forEach(enemy => {
        enemy.follow(player, deltaTime)
        enemy.update(deltaTime, c, gravity, canvas.width)
    })

    // platform
    platforms
        .slice()
        .sort((a, b) => a.position.y - b.position.y)
        .forEach(p => {
            p.draw(c)
            checkCollision(player, p, deltaTime)
            checkCollision(target, p, deltaTime)
            enemies.forEach(enemy => checkCollision(enemy, p, deltaTime))
            if (checkCollision(player, p)) {
                player.isOnGround = true
            }
    })

    // cage
    cage.draw(c)

    checkWinCondition()
    
    const lostObject = [...enemies, target]

    lostObject.forEach (obj => {
        if (isColliding(player, obj))
        {
            gameOver()
        }
    })

    bullets.forEach((b, index) => {
        b.update(deltaTime, canvas.width)
        b.draw(c)

        if (!b.active) bullets.splice(index, 1)
    })

    bullets = bullets.filter((bullet => bullet.active))
    bullets.forEach((bullet) => bullet.draw())
}


let currentLevel = 0
let isWin = false

loadLevel(currentLevel)
animate()

window.addEventListener('keydown', (event) => {
    if (isWin) return
    switch(event.key) {
        case 'd':
            keys.d.pressed = true
            break
        case 'a':
            keys.a.pressed = true
            break
        case 'w':
            if (player.isOnGround) {
                player.velocity.y = jumpForce
                player.isOnGround = false
            }
            break
        case 'ArrowRight':
            keys.arrowRight.pressed = true
            break
        case 'ArrowLeft':
            keys.arrowLeft.pressed = true
            break
        case 'ArrowUp':
            if (player.isOnGround) {
                player.velocity.y = jumpForce
                player.isOnGround = false
            }
    }
})

window.addEventListener('keyup', (event) => {
    switch(event.key) {
        case 'd':
            keys.d.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
        case 'ArrowLeft':
            keys.arrowLeft.pressed = false
            break
        case 'ArrowRight':
            keys.arrowRight.pressed = false
            break
    }
})

window.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
        const direction = player.facing || 1
        const bulletX = player.position.x + player.width / 2
        const bulletY = player.position.y + player.height / 1.5

        bullets.push(new Bullet(bulletX, bulletY, direction))
    }
})

// ----------- Win Condition Start -------------
function checkWinCondition() {
    const gapCage = 15

    const targetInsideCage = (
        target.position.x >= cage.position.x + gapCage &&
        target.position.x + target.width <= cage.position.x + cage.width - gapCage &&
        target.position.y >= cage.position.y &&
        target.position.y + target.height <= cage.position.y + cage.height
    )

    if ( targetInsideCage && !isWin) {
        isWin = true
        uiWin.style.display = "flex"
        Object.values(keys).forEach(k => k.pressed = false)
        cancelAnimationFrame(animationId)
    }
}

document.getElementById("nextLevelButton").addEventListener("click", () => {
    currentLevel++
    // let isDone = false
    // if (currentLevel = 1) isDone = true

    if (currentLevel < levels.length) {
        loadLevel(currentLevel)
        isWin = false
        uiWin.style.display = "none"
        animate()
    } else {
        console.log('game selesai')
    }
})

// ----------- Win Condition End ------------

// ------------ Lose Condition Start ------------
function isColliding(a, b) {
        return (
            a.position.x < b.position.x + b.width &&
            a.position.x + a.width > b.position.x &&
            a.position.y < b.position.y + b.height &&
            a.position.y + a.height > b.position.y
        )
}

function gameOver() {
    cancelAnimationFrame(animationId)
    uiLose.style.display = "flex"
    cancelAnimationFrame(animationId)
    Object.values(keys).forEach (k => k.pressed = false)
}

document.getElementById("retryButton").addEventListener("click", () => {
    loadLevel(currentLevel)
    uiLose.style.display = "none"
    animate()
})
// ----------- Lose Condition End --------------