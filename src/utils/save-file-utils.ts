import { GameState } from "../components/in-game-view/in-game-view";
import { initialState } from "../components/game-screen/game-screen";

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
    return initialState
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
    }
  }
  return false
}

export function isGameState(state: any): state is GameState {
  return state !== undefined &&
      state !== null &&
      typeof state.mood === 'object' &&
      typeof state.time === 'object' &&
      typeof state.stepCount === 'number' &&
      typeof state.position === 'number'
  // TODO: up to date?
}
