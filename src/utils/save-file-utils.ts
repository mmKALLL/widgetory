import { GameState, isGameState } from "../components/game-screen/in-game-view/in-game-view";
import { newGameState } from "../components/game-screen/game-screen";

const itemName = 'saveFile01'

export function saveGame(state: GameState): void {
  const stateJSON = JSON.stringify(state)
  localStorage.setItem(itemName, stateJSON)
  localStorage.setItem('lastSavedAt', Date.now().toString())
  console.log('game saved')
}

export function loadGame(): GameState {
  const saveFile: string | null = localStorage.getItem(itemName)
  if (saveFile === null) {
    console.log('Save file not found despite saveFileExists === true!')
    return newGameState
  }
  console.log(saveFile)
  return JSON.parse(saveFile)
}

export function saveFileExists(): boolean {
  const saveFile = localStorage.getItem(itemName)
  if (typeof saveFile === 'string') {
    const gameState = JSON.parse(saveFile)
    if (isGameState(gameState)) {
      return true
    } else {
      console.log(`isGameState false for following saved gameState:\n\n${saveFile}`)
    }
  }
  return false
}
