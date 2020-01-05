import React from 'react'
import FooterArea from '../../footer-area/footer-area';
import { saveGame } from '../../../utils/save-file-utils';
import ActionPanel from '../../action-panel/action-panel';
import MoodHandler, { Mood } from '../../mood-handler/mood-handler';
import ActionDescriptionText from '../../action-description-text/action-description-text';

const FPS = 50
const DEBUG = true

export type GameState = {
  action: PlayerAction
  money: number
  mood: Mood
  unlockedFeatures: { [key in FeatureName]?: boolean }

  timeToNextOrder: number // time to add an unchecked order in milliseconds
  uncheckedOrders: number
  orders: number
  widgets: number
  testedWidgets: number
  packages: number
  deliveredPackages: number

  timeSinceActionStarted: number
  actionSwitchTime: number // delay between actions to cater for context switch, 'preparing to check orders'
  nextAction: PlayerAction | undefined

  widgetBuildTime: number
  widgetTestTime: number
  widgetPackageTime: number
  packageDeliveryTime: number
}

export type PlayerAction = 'idle' | 'check-orders' | 'build-widget' | 'test-widget' | 'package-widget' | 'deliver-package' | 'change-action'

export type FeatureName = 'order-button' | 'build-button' | 'test-button' | 'package-button' | 'deliver-button'

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
      typeof state.deliveredPackages === 'number'

      // TODO: Add new properties here
}

export const newGameState: GameState = {
  action: 'idle',
  money: 200,
  mood: {
    overall: 20,
    r: 0,
    g: 0,
    b: 0
  },
  unlockedFeatures: {
    "order-button": true,
  },

  timeToNextOrder: 13000,
  uncheckedOrders: 0,
  orders: 0,
  widgets: 0,
  testedWidgets: 0,
  packages: 0,
  deliveredPackages: 0,

  timeSinceActionStarted: 0,
  actionSwitchTime: 2000,
  nextAction: undefined,

  widgetBuildTime: 7000,
  widgetTestTime: 3000,
  widgetPackageTime: 1000, // can package without testing
  packageDeliveryTime: 8000,
}

interface Props {
  initialState: GameState
}

export default class InGameView extends React.Component<Props, GameState> {
  constructor(props: Props) {
    super(props)
    this.state = props.initialState

    window.setInterval(this.updateGameState, 1000 / FPS)
    window.setInterval(() => saveGame(this.state), 10000)
  }

  addOrder = () => {
    this.setState((prevState, _) => {
      return {
        orders: prevState.orders + 1,
        unlockedFeatures: {
          ...prevState.unlockedFeatures,
          "build-button": true
        }
      }
    })
    window.setTimeout(this.addOrder, this.newOrderTime())
  }

  // Return time between orders in milliseconds
  newOrderTime = (): number => {
    return 300000 / (this.state.deliveredPackages + 10)
  }

  setPlayerAction = (newAction: PlayerAction): void => {
    this.setState({
      action: newAction
    })
  }

  updateGameState = (): void => {
    this.setState(this.nextState)
  }

  nextState = (state: GameState, props: Props): GameState => {
    const ns: GameState = { ...state } // newState; shallow copy

    // update general stuff
    ns.money += 1

    // update orders
    ns.timeToNextOrder -= 1000 / FPS
    if (ns.timeToNextOrder < 0) {
      ns.uncheckedOrders += 1
      ns.timeToNextOrder = this.newOrderTime()
    }
    if (ns.action === 'check-orders') {
      ns.orders += ns.uncheckedOrders
      ns.uncheckedOrders = 0
    }

    // handle other actions
    if (ns.action === 'build-widget' || ns.action === 'test-widget' || ns.action === 'package-widget' || ns.action === 'deliver-package') {

    }

    // check unlocks
    ns.unlockedFeatures = {
      ...ns.unlockedFeatures
    }
    if (ns.orders > 0) { ns.unlockedFeatures["build-button"] = true }
    if (ns.widgets > 0) { ns.unlockedFeatures["test-button"] = true }
    if (ns.testedWidgets > 0) { ns.unlockedFeatures["package-button"] = true }
    if (ns.packages > 0) { ns.unlockedFeatures["deliver-button"] = true }
    return ns
  }

  render() {
    return (
      <div className='game-container'>
        { DEBUG && <div>Current action: {this.state.action}</div> }
        <div>Money: {this.state.money}</div>
        <div>Orders: {this.state.orders}</div>
        { DEBUG && <div>unlockedFeatures: {Object.entries(this.state.unlockedFeatures).join(', ')}</div> }

        <ActionDescriptionText currentAction={this.state.action} />
        <ActionPanel
          orders={this.state.orders}
          setPlayerAction={this.setPlayerAction}
          unlockedFeatures={this.state.unlockedFeatures}
        />
        <FooterArea />
        <MoodHandler mood={this.state.mood} />
      </div>
    )
  }
}

