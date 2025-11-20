import { inputLocked } from "./gameState.js"
import { keys } from "./inputKeys.js"

window.addEventListener('keydown', (event) => {
})

window.addEventListener('keydown', (event) => {
    if (inputLocked()) return

    switch(event.key) {
        case 'd':
            keys.d.pressed = true
            break
        case 'a':
            keys.a.pressed = true
            break
        case 'w':
            keys.w.pressed = true
            break
        case 'ArrowRight':
            keys.arrowRight.pressed = true
            break
        case 'ArrowLeft':
            keys.arrowLeft.pressed = true
            break
        case 'ArrowUp':
            keys.arrowUp.pressed = true
            break
    }
})

window.addEventListener('keyup', (event) => {
    if (inputLocked()) return
    switch(event.key) {
        case 'd':
            keys.d.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
        case 'ArrowUp':
            keys.arrowUp.pressed = false
            break
        case 'ArrowLeft':
            keys.arrowLeft.pressed = false
            break
        case 'ArrowRight':
            keys.arrowRight.pressed = false
            break
    }
})


