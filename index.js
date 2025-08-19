const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

const gravity = 0.3

c.fillRect(0, 0, canvas.width, canvas.height)

const uiWin = document.getElementById("winScreen")
uiWin.style.width = canvas.width + "px"
uiWin.style.height = canvas.height + "px"
uiWin.style.display = "none"

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

    applyMovement(keys) {

    }

    update() {
        this.draw()

        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        this.velocity.y += gravity

        if(this.position.y + this.height >= canvas.height) {
            this.position.y = canvas.height - this.height
            this.velocity.y = 0
            this.isOnGround = true
        }

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
    handleInput(keys) {
        const accel = 0.22
        const maxSpeed = 4
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
            this.velocity.x -= accel
        } else if (keys.d.pressed || keys.arrowRight.pressed) {
            this.velocity.x += accel
        } else {
            this.velocity.x *= deccel
        }

        if (this.velocity.x > maxSpeed) this.velocity.x = maxSpeed
        if (this.velocity.x < -maxSpeed) this.velocity.x = -maxSpeed
    }
}

class She extends Sprite {
    follow(player) {
        const speed = 1.7
        const range = 210
        
        const dx = player.position.x - this.position.x
        const distanceX = Math.abs(dx)

        if (distanceX > range) {
            this.velocity.x = 0
        } else {
            this.velocity.x = dx > 0 ? speed : -speed
        }
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

let player, she, cage, platforms = []

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
        she: {
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
        ]
        // level 0 end -------------------------
    }, {
        // level 1 start -----------------------
        player: {
            x: 50,
            y: canvas.height - charHeight - groundHeight
        },
        she: {
            x: 860,
            y: 375 - charHeight
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
        ]
        // level 1 end -----------------------
    }
]

function loadLevel(index) {
    const data = levels[index]

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

    she = new She({
        width: charWidth,
        height: charHeight,
        position: {
            x: data.she.x,
            y: data.she.y
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

function checkCollision(player, platform) {

    if (
        player.position.y + player.height <= platform.position.y &&
        player.position.y + player.height + player.velocity.y >= platform.position.y &&
        player.position.x + player.width >= platform.position.x &&
        player.position.x <= platform.position.x + platform.width
    ) {
        player.velocity.y = 0
        player.isOnGround = true
        player.position.y = platform.position.y - player.height
    }

    if (
        player.position.y >= platform.position.y + platform.height &&
        player.position.y + player.velocity.y <= platform.position.y + platform.height &&
        player.position.x + player.width >= platform.position.x &&
        player.position.x <= platform.position.x + platform.width
    ) {
        player.velocity.y = 0
        player.position.y = platform.position.y + platform.height
    }

    const overlapY = player.position.y + player.height > platform.position.y && player.position.y < platform.position.y + platform.height

    if (
        overlapY &&
        player.position.x + player.width <= platform.position.x &&
        player.position.x + player.width + player.velocity.x >= platform.position.x
    ) {
        player.velocity.x = 0
        player.position.x = platform.position.x - player.width
    }

    if (
        overlapY &&
        player.position.x >= platform.position.x + platform.width &&
        player.position.x + player.velocity.x <= platform.position.x + platform.width
    ) {
        player.velocity.x = 0
        player.position.x = platform.position.x + platform.width
    }
}

function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)

    player.handleInput(keys)
    she.follow(player)

    player.update()
    she.update()

    player.isOnGround = false
    she.isOnGround = false

    // platform
    platforms.forEach(p => {
        p.draw()
        checkCollision(player, p)
        checkCollision(she, p)
    })

    // cage
    cage.draw()

    checkWinCondition()
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
                player.velocity.y = -10.5
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
                player.velocity.y = -10.5
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

function checkWinCondition() {
    const gapCage = 15

    const sheInsideCage = (
        she.position.x >= cage.position.x + gapCage &&
        she.position.x + she.width <= cage.position.x + cage.width - gapCage &&
        she.position.y >= cage.position.y &&
        she.position.y + she.height <= cage.position.y + cage.height
    )

    if ( sheInsideCage && !isWin) {
        isWin = true
        uiWin.style.display = "flex"
        Object.values(keys).forEach(k => k.pressed = false)
    }
}

document.getElementById("nextLevelButton").addEventListener("click", () => {
    currentLevel++
    if (currentLevel < levels.length) {
        loadLevel(currentLevel)
    } else {
        console.log('game selesai')
    }
    isWin = false
    uiWin.style.display = "none"
})