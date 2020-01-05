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

  widgetParts: number
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

  widgetPrice: number
  widgetPartPrice: number
  timeUntilOrderCancel: number
  defaultTimeUntilOrderCancel: number
}

// action names other than 'idle' should have a verb and noun, both in base form (ignore plural, tense, etc)
export type PlayerAction = 'idle' | 'check-orders' | 'build-widget' | 'test-widget' | 'package-widget' | 'deliver-package' | 'change-action'

export type FeatureName = 'order-button' | 'build-button' | 'test-button' | 'package-button' | 'deliver-button' | 'purchase-parts-button'

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
  money: 40000, // in something similar to 2019 yen - i.e. USD 0.01
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

  widgetParts: 10,
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
  packageDeliveryTime: 12000,

  widgetPrice: 1400,
  widgetPartPrice: 850,
  timeUntilOrderCancel: 300000,
  defaultTimeUntilOrderCancel: 300000,
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

  setPlayerAction = (newAction: PlayerAction): void => {
    if (newAction === this.state.action) {
      // cancel current action
      this.setState({
        action: 'idle'
      })
    } else {
      this.setState({
        action: 'change-action',
        nextAction: newAction,
        timeSinceActionStarted: 0
      })
    }
  }

  updateGameState = (): void => {
    this.setState(nextState)
  }

  render() {
    return (
      <div className='game-container'>
        { DEBUG && <div>Current action: {this.state.action}</div> }
        <div>Money: {this.state.money}</div>
        { DEBUG && <div>Orders: {this.state.orders}</div> }
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

// create and return the next GameState based on the current one
const nextState = (state: GameState, _: Props): GameState => {
  const ns: GameState = { ...state } // newState; shallow copy

  // update general stuff
  ns.money += 1

  // update orders
  ns.timeToNextOrder -= 1000 / FPS
  if (ns.timeToNextOrder < 0) {
    ns.uncheckedOrders += 1
    ns.timeToNextOrder = newOrderTime(ns.deliveredPackages)
  }
  if (ns.action === 'check-orders') {
    ns.orders += ns.uncheckedOrders
    ns.money += ns.uncheckedOrders * ns.widgetPrice
    ns.uncheckedOrders = 0
  }


  // handle other actions
  ns.timeSinceActionStarted += 1000 / FPS
  const targetTime = getActionTargetTime(ns)
  if (ns.action === 'build-widget' || ns.action === 'test-widget' || ns.action === 'package-widget' || ns.action === 'deliver-package' || ns.action === 'change-action') {
    if (ns.timeSinceActionStarted >= targetTime) {
      ns.timeSinceActionStarted -= targetTime
      switch (ns.action) {
        case 'build-widget':
          ns.widgets += 1
          ns.widgetParts -= 1
          break
        case 'test-widget':
          ns.testedWidgets += 1
          ns.widgets -= 1
          break
        case 'package-widget':
          ns.packages += 1
          ns.testedWidgets -= 1
          break
        case 'deliver-package':
          const numberDelivered = Math.min(ns.orders, ns.packages)

          ns.orders -= numberDelivered
          ns.deliveredPackages += numberDelivered
          ns.timeUntilOrderCancel += newOrderTime(ns.deliveredPackages) * numberDelivered
          ns.packages = 0

          ns.widgetPrice -= numberDelivered
          break

        case 'change-action':
          ns.action = ns.nextAction !== undefined ? ns.nextAction : 'idle'
          ns.nextAction = undefined
          ns.timeSinceActionStarted = 0
          break

        default:

      }
    }
  }

  // check unlocks
  ns.unlockedFeatures = {
    ...ns.unlockedFeatures
  }
  if (ns.orders > 0) { ns.unlockedFeatures["build-button"] = true }
  if (ns.widgets > 0) { ns.unlockedFeatures["test-button"] = true }
  if (ns.testedWidgets > 0) { ns.unlockedFeatures["package-button"] = true }
  if (ns.packages > 0) { ns.unlockedFeatures["deliver-button"] = true }
  if (ns.widgetParts === 0) { ns.unlockedFeatures["purchase-parts-button"] = true }
  return ns
}

// Return time between orders in milliseconds
const newOrderTime = (deliveredPackages: number): number => {
  return 300000 / (deliveredPackages + 10)
}

const getActionTargetTime = (state: GameState): number => {
  switch (state.action) {
    case 'build-widget': return state.widgetBuildTime
    case 'test-widget': return state.widgetTestTime
    case 'package-widget': return state.widgetPackageTime
    case 'deliver-package': return state.packageDeliveryTime
    case 'change-action': return state.actionSwitchTime
    default:
      return 1000000000
  }
}
