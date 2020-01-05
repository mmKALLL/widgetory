import { GameState, newGameState } from "../components/game-screen/in-game-view/in-game-view";

const itemName = 'saveFile01'

export function saveGame(state: GameState): void {
  const stateJSON = JSON.stringify(state)
  localStorage.setItem(itemName, stateJSON)
  localStorage.setItem('lastSavedAt', Date.now().toString())
  console.log(`game saved`)
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

export function deleteSaveFileWithConfirm(): void {
  if (window.confirm('Really hard reset?\nTHIS WILL DELETE ALL SAVED DATA. \n\nPress Cancel/No if unsure.')) {
    if (!window.confirm('Please press OK/Yes to be saved.\n (Press No/Cancel if you really really want to delete all your saved data.)')) {
      localStorage.removeItem(itemName)
      localStorage.removeItem('saveFile02')
      localStorage.removeItem('saveFile03')
      localStorage.removeItem('saveFile04')
      window.location.reload()
    }
  }
}

export function isGameState(state: any): state is GameState {
  return state !== undefined &&
      state !== null &&

      typeof state.action === 'string' &&
      typeof state.money === 'number' &&
      typeof state.mood === 'object' &&
      typeof state.unlockedFeatures === 'object' &&

      typeof state.uncheckedOrders === 'number' &&
      typeof state.orders === 'number' &&
      typeof state.widgets === 'number' &&
      typeof state.testedWidgets === 'number' &&
      typeof state.packages === 'number' &&
      typeof state.completedOrders === 'number'

      // TODO: Add new properties here
}
