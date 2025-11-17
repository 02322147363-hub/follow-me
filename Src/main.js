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

class Sprite {
    constructor({width, height, position, velocity, color}) {
        this.width = width
        this.height = height
        this.position = position
        this.velocity = velocity
        this.color = color
        this.isOnGround = false
    }

    draw() {
        c.fillStyle = this.color
        c.fillRect (this.position.x, this.position.y, this.width, this.height)
    }

    update(deltaTime = 1) {
        this.draw()

        this.position.x += this.velocity.x * deltaTime
        this.position.y += this.velocity.y * deltaTime
        this.velocity.y += gravity * deltaTime

        if (this.position.x < 0) {
            this.position.x = 0
            this.velocity.x = 0
        }

        if (this.position.x + this.width > canvas.width) {
            this.position.x = canvas.width - this.width
            this.velocity.x = 0
        }
    }
}

class Player extends Sprite {
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

        if (keys.arrowRight.pressed || keys.d.pressed) player.facing = 1
        if (keys.arrowLeft.pressed || keys.a.pressed) player.facing = -1
    }
}

class Target extends Sprite {
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
}

class Enemy extends Sprite {
    follow(player, deltaTime) {
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
    }
}

class Platform {
    constructor({x, y, width, height, color = 'green'}) {
        this.position = {x, y}
        this.width = width
        this.height = height
        this.color = color
    }

    draw() {
        c.fillStyle = this.color
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}

class Cage {
    constructor({position, width, height}) {
        this.position = position
        this.width = width
        this.height = height
    }

    draw() {
        c.strokeStyle = "yellow"
        c.lineWidth = 4
        c.strokeRect(this.position.x, this.position.y, this.width, this.height)
    }
}

class Bullet {
    constructor(x, y, direction) {
        this.width = 10
        this.height = 5
        this.speed = 500
        this.position = {x, y}
        this.velocity  =  { x: this.speed * direction, y: 0}
        this.active = true
    }

    update(deltaTime) {
        this.position.x += this.velocity.x * deltaTime

        if (this.position.x < 0 || this.position.x > canvas.width) {
            this.active = false
        }
    }

    draw() {
        c.fillStyle = "yellow"
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}

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

    function findPlatformUnderX(x) {
        return platforms.find(p => (x >= p.position.x) && (x <= p.position.x + p.width))
    }

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
    target.follow(player, deltaTime)

    player.update(deltaTime)
    target.update(deltaTime)

    enemies.forEach(enemy => {
        enemy.follow(player, deltaTime)
        enemy.update(deltaTime)
    })

    // platform
    platforms
        .slice()
        .sort((a, b) => a.position.y - b.position.y)
        .forEach(p => {
            p.draw()
            checkCollision(player, p, deltaTime)
            checkCollision(target, p, deltaTime)
            enemies.forEach(enemy => checkCollision(enemy, p, deltaTime))
            if (checkCollision(player, p)) {
                player.isOnGround = true
            }
    })

    // cage
    cage.draw()

    checkWinCondition()
    
    const lostObject = [...enemies, target]

    lostObject.forEach (obj => {
        if (isColliding(player, obj))
        {
            gameOver()
        }
    })

    bullets.forEach((bullet => bullet.update(deltaTime)))
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