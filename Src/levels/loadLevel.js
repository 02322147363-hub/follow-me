import Player from "../entities/Player.js"
import Enemy from "../entities/Enemy.js"
import Target from "../entities/Target.js"
import Cage from "../entities/Cage.js"
import Platform from "../entities/Platform.js"
import { unlockInput } from "../systems/gameState.js"

export function loadLevel(index, levels, canvas) {
    unlockInput()

    const charWidth = 20
    const charHeight = 50
    const cageVertices = 75
    const groundHeight = 50

    const data = levels[index]

    const player = new Player({
        width: charWidth,
        height: charHeight,
        position: { x: data.player.x, y: data.player.y },
        velocity: { x: 0, y: 0 },
        color: "blue"
    })

    const target = new Target({
        width: charWidth,
        height: charHeight,
        position: { x: data.target.x, y: data.target.y },
        velocity: { x: 0, y: 0 },
        color: "pink"
    })

    const cage = new Cage({
        position: { x: data.cage.x, y: data.cage.y },
        width: cageVertices,
        height: cageVertices
    })

    const platforms = data.platforms.map(p =>
        new Platform({
            x: p.x,
            y: p.y,
            width: p.width,
            height: p.height
        })
    )

    const enemies = (data.enemies || []).map(e => {
        let spawnY = canvas.height - groundHeight - charHeight

        if (typeof e.y === "number") {
            spawnY = e.y
        } else if (typeof e.platformIndex === "number") {
            const p = platforms[e.platformIndex]
            if (p) spawnY = p.position.y - charHeight
        }

        return new Enemy({
            width: charWidth,
            height: charHeight,
            position: { x: e.x, y: spawnY },
            velocity: { x: 0, y: 0 },
            color: "red"
        })
    })

    return { player, target, cage, platforms, enemies }
}
