const charWidth = 20
const charHeight = 50
const cageVertices = 75
const groundHeight = 50
const canvasWidth = 1024
const canvasHeight = 576

export const levels = [
    {
        player: {
            x: 50,
            y: canvasHeight - charHeight - groundHeight
        },
        target: {
            x: 760,
            y: canvasHeight - charHeight - groundHeight
        },
        cage: {
            x: 120,
            y: canvasHeight - cageVertices - groundHeight
        },
        platforms: [
            { x: 0, y: canvasHeight - groundHeight, width: canvasWidth, height: groundHeight }
        ],
        enemies: []
    },
    {
        player: {
            x: 50,
            y: canvasHeight - charHeight - groundHeight
        },
        target: {
            x: 860,
            y: canvasHeight - charHeight - groundHeight
        },
        cage: {
            x: 120,
            y: canvasHeight - cageVertices - groundHeight
        },
        platforms: [
            { x: 0, y: canvasHeight - groundHeight, width: canvasWidth, height: groundHeight },
            { x: canvasWidth - 600, y: 375, width: 600, height: 20 }
        ],
        enemies: [
            { x: 860, platformIndex: 1 }
        ]
    }
]
