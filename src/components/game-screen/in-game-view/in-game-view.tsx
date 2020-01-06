import React from 'react'
import FooterArea from '../../footer-area/footer-area';
import { saveGame } from '../../../utils/save-file-utils';
import ActionPanel from '../../action-panel/action-panel';
import MoodHandler, { Mood } from '../../mood-handler/mood-handler';
import InformationPanel from '../../information-panel/information-panel';

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
  completedOrders: number

  timeSinceActionStarted: number
  actionSwitchTime: number // delay between actions to cater for context switch, 'preparing to check orders'
  nextAction: PlayerAction | undefined

  checkOrderTime: number
  widgetBuildTime: number
  widgetTestTime: number
  widgetPackageTime: number
  packageDeliveryTime: number

  widgetPrice: number
  widgetPartPrice: number
  timeUntilOrderCancel: number
}

// action names other than 'idle' should have a verb and noun, in imperative and base singular/plural form
export type PlayerAction = 'idle' | 'change-action' | 'check-orders' | 'build-widget' | 'test-widget' | 'package-widget' | 'deliver-packages' | 'purchase-parts'

export type FeatureName = 'order-button' | 'build-button' | 'test-button' | 'package-button' | 'deliver-button' | 'purchase-parts-button'

export const newGameState: GameState = {
  action: 'idle',
  money: 40000, // in something similar to 2019 yen - i.e. USD 0.01
  mood: {
    overall: 28,
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

  widgetParts: 8,
  widgets: 0,
  testedWidgets: 0,
  packages: 0,
  completedOrders: 0,

  timeSinceActionStarted: 0,
  actionSwitchTime: 2000,
  nextAction: undefined,

  checkOrderTime: 3000,
  widgetBuildTime: 7000,
  widgetTestTime: 3000,
  widgetPackageTime: 1200, // can package without testing
  packageDeliveryTime: 12000,

  widgetPrice: 1400,
  widgetPartPrice: 850,
  timeUntilOrderCancel: 75000,
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
        <InformationPanel
          debugEnabled={DEBUG}
          state={this.state}
        />

        <ActionPanel
          orders={this.state.orders}
          parts={this.state.widgetParts}
          widgets={this.state.widgets}
          testedWidgets={this.state.testedWidgets}
          packages={this.state.packages}
          completedOrders={this.state.completedOrders}

          partPrice={this.state.widgetPartPrice}

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

  // update mood
  // TODO

  // update orders
  ns.timeToNextOrder -= 1000 / FPS
  if (ns.timeToNextOrder < 0) {
    ns.uncheckedOrders += 1
    ns.timeToNextOrder = newOrderTime(ns.completedOrders)
  }

  // handle other actions
  ns.timeSinceActionStarted += 1000 / FPS
  const targetTime = getActionTargetTime(ns)
  if (ns.action === 'check-orders' || ns.action === 'build-widget' || ns.action === 'test-widget' || ns.action === 'package-widget' || ns.action === 'deliver-packages' || ns.action === 'change-action') {
    if (ns.timeSinceActionStarted >= targetTime) {
      ns.timeSinceActionStarted -= targetTime
      switch (ns.action) {
        case 'change-action':
          ns.action = ns.nextAction !== undefined ? ns.nextAction : 'idle'
          ns.nextAction = undefined
          ns.timeSinceActionStarted = 0
          break
        case 'check-orders':
          console.log(`got ${ns.uncheckedOrders} new orders, received ${ns.uncheckedOrders * ns.widgetPrice} yen`)
          ns.orders += ns.uncheckedOrders
          ns.money += ns.uncheckedOrders * ns.widgetPrice
          ns.uncheckedOrders = 0
          break
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
        case 'deliver-packages':
          const numberDelivered = Math.min(ns.orders, ns.packages)
          console.log(`delivering ${numberDelivered} packages`)

          ns.orders -= numberDelivered
          ns.completedOrders += numberDelivered
          ns.timeUntilOrderCancel += newOrderTime(ns.completedOrders) * numberDelivered
          ns.packages -= numberDelivered

          ns.widgetPrice -= numberDelivered

          ns.action = 'idle'
          break

        default:

      }
    }
  }

  // update cancellations
  ns.timeUntilOrderCancel -= 1000 / FPS
  if (ns.timeUntilOrderCancel < 0) {
    if (ns.orders > 0) {
      ns.orders -= 1
      ns.money -= ns.widgetPrice
      console.log(`cancelled order, lost ${ns.widgetPrice} yen, ${ns.orders} checked and ${ns.uncheckedOrders} unchecked left`)
    } else {
      ns.uncheckedOrders -= 1
      console.log(`cancelled unchecked order, lost no yen, ${ns.orders} checked and ${ns.uncheckedOrders} unchecked left`)
    }
    ns.timeUntilOrderCancel = newTimeUntilOrderCancel(ns.completedOrders, ns.orders + ns.uncheckedOrders)
  }

  // Randomly change the market situation; proportional ease over time towards magic constants, with random multipliers
  if (Math.random() < 1 / (ns.completedOrders / 1000 + 1000)) {
    ns.widgetPrice += Math.floor((Math.random() - 0.3) * ((8457 - ns.widgetPrice) / 100))
  }
  if (Math.random() < 1 / (ns.widgetParts + 1000)) {
    ns.widgetPartPrice -= Math.floor((Math.random() - 0.3) * ((128 + ns.widgetPartPrice) / 100))
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
  return 25 * 1000 * 40 / (deliveredPackages + 40)
}

const newTimeUntilOrderCancel = (deliveredPackages: number, outstandingOrders: number): number => {
  return 120 * 1000 * 10000 / (deliveredPackages + 10000) / (Math.pow(outstandingOrders + 1, 0.7)) // ~120s divided by orders until lategame
}

export const getActionTargetTime = (state: GameState): number => {
  switch (state.action) {
    case 'check-orders': return state.checkOrderTime
    case 'build-widget': return state.widgetBuildTime
    case 'test-widget': return state.widgetTestTime
    case 'package-widget': return state.widgetPackageTime
    case 'deliver-packages': return state.packageDeliveryTime
    case 'change-action': return state.actionSwitchTime
    default:
      return 10000000000
  }
}

