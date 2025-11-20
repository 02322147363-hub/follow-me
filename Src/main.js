import Bullet from "./entities/Bullet.js"
import { keys, resetInput } from "./systems/inputKeys.js"
import "./systems/input.js"
import { inputLocked, unlockInput, lockInput, setWin } from "./systems/gameState.js"
import { checkCollision } from "./systems/collision.js"
import { levels } from "./levels/levelData.js"
import { loadLevel } from "./levels/loadLevel.js"
import { createUIManager } from "./systems/ui.js"

const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

const gravity = 1200

c.fillRect(0, 0, canvas.width, canvas.height)

let currentLevel = 0
let isWin = false

let { player, target, cage, platforms, enemies } =
    loadLevel(currentLevel, levels, canvas)

let bullets = []

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
        bullets.forEach(bullet => {
            if (
                bullet.position.x < enemy.position.x + enemy.width &&
                bullet.position.x + bullet.width > enemy.position.x &&
                bullet.position.y < enemy.position.y + enemy.height &&
                bullet.position.y + bullet.height > enemy.position.y
            ) {
                enemy.isDead = true
                bullet.active = false
            }
        })
        
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
         if (obj.isDead) return
        
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
    bullets.forEach((bullet) => bullet.draw(c))
}

animate()

const ui = createUIManager({
    loadLevel,
    animate,
    levels,
    canvas
})

let lastShotTime = 0
const fireCooldown = 0.25 



window.addEventListener("levelSelected", (e) => {
    const { player: p, target: t, cage: c, platforms: pf, enemies: en } = e.detail
    player = p
    target = t
    cage = c
    platforms = pf
    enemies = en
})

window.addEventListener("keydown", (e) => {

    if (inputLocked()) return

    if (e.code === "Space") {

        const now = performance.now() / 1000 
        if (now - lastShotTime < fireCooldown) return
        
        lastShotTime = now

        const direction = player.facing || 1
        const bulletX = player.position.x + player.width / 2
        const bulletY = player.position.y + player.height / 1.5

        bullets.push(new Bullet(bulletX, bulletY, direction))
    }

    if (e.key === 'w' || e.key === 'ArrowUp') {
        player.handleJump()
    }

    if (e.key === 'Escape') {
        ({ player, target, cage, platforms, enemies } =
        loadLevel(currentLevel, levels, canvas))
        ui.goToMainMenu();
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

    if (targetInsideCage && !isWin) {
        setWin(true)

        const lastIndex = levels.length - 1

        if (currentLevel === lastIndex) {
            ui.showEnd()
        } else {
            ui.showWin()
        }

        cancelAnimationFrame(animationId)
    }
}

document.getElementById("nextLevelButton").addEventListener("click", () => {
    currentLevel++
    // let isDone = false
    // if (currentLevel = 1) isDone = true

    if (currentLevel < levels.length) {
        ({ player, target, cage, platforms, enemies } =
            loadLevel(currentLevel, levels, canvas))

        isWin = false
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
    ui.showLose()
    cancelAnimationFrame(animationId)
}

document.getElementById("retryButton").addEventListener("click", () => {
    ({ player, target, cage, platforms, enemies } =
        loadLevel(currentLevel, levels, canvas))
    animate()
})
// ----------- Lose Condition End --------------