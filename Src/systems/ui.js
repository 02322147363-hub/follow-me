import { resetInput } from "./inputKeys.js"
import { lockInput, unlockInput } from "./gameState.js"

export function createUIManager({ loadLevel, animate, levels, canvas }) {
    let currentLevel = 0
    let gameRunning = false

    function show(id) {
        document.getElementById(id).style.display = "flex"
        lockInput()
        gameRunning = false
    }

    function hide(id) {
        document.getElementById(id).style.display = "none"
        unlockInput()
        gameRunning = true
    }

    // ---------- MAIN MENU ----------
    document.getElementById("playBtn").onclick = () => {
        hide("mainMenu")
        show("levelSelect")
    }

    document.getElementById("creditBtn").onclick = () => {
        hide("mainMenu")
        show("creditMenu")
    }

    document.getElementById("backToMainFromCredit").onclick = () => {
        hide("creditMenu")
        show("mainMenu")
    }

    document.getElementById("backToMainFromLevel").onclick = () => {
        hide("levelSelect")
        show("mainMenu")
    }

    // ---------- SELECT LEVEL ----------
    document.querySelectorAll(".levelButton").forEach(btn => {
        btn.onclick = () => {
            const selected = Number(btn.dataset.level)
            currentLevel = selected

            const newState = loadLevel(selected, levels, canvas)
            window.dispatchEvent(new CustomEvent("levelSelected", { detail: newState }))

            hide("levelSelect")
            gameRunning = true
            animate()
        }
    })

    // ---------- WIN ----------
    document.getElementById("nextLevelButton").onclick = () => {
        currentLevel++
        if (currentLevel < levels.length) {
            loadLevel(currentLevel, levels, canvas)
            hide("winScreen")  
        } else {
            hide("winScreen")
            show("endScreen")
        }
    }

    // ---------- LOSE ----------
    document.getElementById("retryButton").onclick = () => {
        loadLevel(currentLevel, levels, canvas)
        hide("loseScreen")
    }

    // ---------- END ----------
    document.getElementById("endToMainBtn").onclick = () => {
        hide("endScreen")
        show("mainMenu")
    }

    // mulai dari main menu
    show("mainMenu")

    function showWin() {
        show("winScreen")   // tampilkan UI-nya
        lockInput()
        resetInput()
    }

    function showLose() {
        show("loseScreen")
        lockInput()
        resetInput()
    }

    function showEnd() {
        show("endScreen")
        lockInput()
        resetInput()
    }

    
    function goToMainMenu() {
        gameRunning = false
        lockInput()
        resetInput()

        hide("winScreen")
        hide("loseScreen")
        hide("levelSelect")
        hide("creditMenu")
        hide("endScreen")

        show("mainMenu")
    }


    return {
        goToMainMenu,
        pauseGame: () => {
            gameRunning = false
            lockInput()
            show("pauseMenu")
        },
        isGameRunning: () => gameRunning,
        showWin,
        showLose,
        showEnd
    }
}
