let win = false
let inputLock = false

export function setWin(value) {
    win = value
}

export function isWin() {
    return win
}

export function lockInput() {
    inputLock = true
}

export function unlockInput() {
    inputLock = false
}

export function inputLocked() {
    return inputLock
}
