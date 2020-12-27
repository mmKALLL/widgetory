import React from 'react'
import FooterArea from '../../footer-area/footer-area';
import { saveGame } from '../../../utils/save-file-utils';
import ActionPanel from '../../action-panel/action-panel';
import MoodHandler from '../../mood-handler/mood-handler';
import InformationPanel from '../../information-panel/information-panel';
import { DEBUG, FPS, GameState, PlayerAction } from '../../../types';
import { assertNever, sum } from '../../../utils/utilities';

interface Props {
  initialState: GameState
}

export default class InGameView extends React.Component<Props, GameState> {
  constructor(props: Props) {
    super(props)
    this.state = props.initialState

    window.setInterval(this.updateGameState, 1000 / FPS)
    window.setInterval(() => saveGame(this.state), 5 * 1000) // autosave every 5 seconds
    window.setInterval(this.payWorkerSalaries, 60 * 1000) // pay 1/60 hourly salaries every minute
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

  payWorkerSalaries = (): void => {
    this.setState(paySalaries)
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
  if (ns.action !== 'idle') {
    if (ns.timeSinceActionStarted >= targetTime) {
      ns.timeSinceActionStarted -= targetTime
      switch (ns.action) {
        case 'change-action':
          ns.action = ns.nextAction ?? 'idle'
          ns.nextAction = undefined
          ns.timeSinceActionStarted = 0
          break
        case 'check-orders':
          ns.orders += ns.uncheckedOrders
          ns.uncheckedOrders = 0
          ns.energyUsed += 0.1
          ns.action = 'idle'
          break
        case 'build-widget':
          if (ns.widgetParts > 0) {
            ns.widgets += 1
            ns.widgetParts -= 1
            ns.energyUsed += 2.0
          }
          if (ns.widgetParts <= 0) {
            ns.action = 'idle'
          }
          break
        case 'test-widget':
          if (ns.widgets > 0) {
            ns.energyUsed += 0.6
            ns.testedWidgets += 1
            ns.widgets -= 1
          }
          if (ns.widgets <= 0) {
            ns.action = 'idle'
          }
          break
        case 'package-widget':
          if (ns.testedWidgets > 0) {
            ns.packages += 1
            ns.testedWidgets -= 1
          }
          if (ns.testedWidgets <= 0) {
            ns.action = 'idle'
          }
          break
        case 'deliver-packages':
          const numberDelivered = Math.min(ns.orders, ns.packages)
          console.log(`delivering ${numberDelivered} packages`)

          ns.orders -= numberDelivered
          ns.completedOrders += numberDelivered
          ns.timeUntilOrderCancel += newOrderTime(ns.completedOrders) * numberDelivered
          ns.packages -= numberDelivered
          ns.money += numberDelivered * ns.widgetPrice

          ns.widgetPrice -= numberDelivered

          ns.action = 'idle'
          break
        case 'purchase-parts':
          if (ns.money >= ns.widgetPartPrice) {
            ns.widgetParts += 1
            ns.money -= ns.widgetPartPrice
          }
          break
        case 'hire-worker':
          if (ns.money >= ns.workerHourlySalary * 8) {
            ns.unassignedWorkers += 1
          } else {
            ns.action ='idle'
          }
          break
        default: assertNever(ns.action)
      }
    }
  }

  // update cancellations
  ns.timeUntilOrderCancel -= 1000 / FPS
  if (ns.timeUntilOrderCancel < 0) {
    if (ns.orders > 0) {
      ns.orders -= 1
      // ns.money -= ns.widgetPrice // TODO: Add this back once player can research "get money at time of order"
      if (DEBUG) console.log(`cancelled order, lost ${ns.widgetPrice} yen, ${ns.orders} checked and ${ns.uncheckedOrders} unchecked left, next in ${newTimeUntilOrderCancel(ns.completedOrders, ns.orders + ns.uncheckedOrders) / 1000} seconds`)
    } else {
      ns.uncheckedOrders -= 1
      if (DEBUG) console.log(`cancelled unchecked order, lost no yen, ${ns.orders} checked and ${ns.uncheckedOrders} unchecked left, next in ${newTimeUntilOrderCancel(ns.completedOrders, ns.orders + ns.uncheckedOrders) / 1000} seconds`)
    }
    ns.timeUntilOrderCancel = newTimeUntilOrderCancel(ns.completedOrders, ns.orders + ns.uncheckedOrders)
  }

  // Randomly change the market situation; proportional ease over time towards magic constants, with random multipliers
  if (Math.random() < 1 / (ns.completedOrders / 1000 + 1000)) {
    ns.widgetPrice += Math.floor((Math.random() - 0.3) * ((8457 - ns.widgetPrice) / 100))
    if (DEBUG) console.log(`widget price changed to ${ns.widgetPrice}`)
  }
  if (Math.random() < 1 / (ns.widgetParts + 1000)) {
    ns.widgetPartPrice -= Math.floor((Math.random() - 0.3) * ((128 + ns.widgetPartPrice) / 100))
    if (DEBUG) console.log(`widget part price changed to ${ns.widgetPartPrice}`)
  }

  // check unlocks
  ns.unlockedFeatures = { ...ns.unlockedFeatures } // shallow copy
  if (ns.orders > 0 && !ns.unlockedFeatures["build-button"]) { ns.action = 'idle'; ns.unlockedFeatures["build-button"] = true }
  if (ns.widgets >= 3) { ns.unlockedFeatures["test-button"] = true }
  if (ns.testedWidgets >= 3) { ns.unlockedFeatures["package-button"] = true }
  if (ns.packages > 0) { ns.unlockedFeatures["deliver-button"] = true }
  if (ns.widgetParts === 0) { ns.unlockedFeatures["purchase-parts-button"] = true }

  if (ns.completedOrders === 7) { ns.unlockedFeatures["hire-worker-button"] = true }
  if (ns.unassignedWorkers > 0) { ns.unlockedFeatures["assign-worker-buttons"] = true }
  // if (ns.completedOrders === 16) { ns.unlockedFeatures["hire-sales-specialist-button"] = true }
  // if (ns.completedOrders === 40) { ns.unlockedFeatures["hire-consultant-button"] = true }

  return ns
}

// called every minute to pay salaries to workers
const paySalaries = (state: GameState, _: Props): GameState => {
  const ns: GameState = { ...state } // newState; shallow copy
  ns.money -= (ns.unassignedWorkers + getAssignedWorkerAmount(ns)) * ns.workerHourlySalary / 60
  return ns
}

const getAssignedWorkerAmount = (state: GameState): number => {
  return sum(Object.values(state.assignedWorkers).map(v => v ?? 0))
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
    case 'idle': return 100000000
    case 'change-action': return state.actionSwitchTime

    case 'check-orders': return state.checkOrderTime
    case 'build-widget': return state.widgetBuildTime
    case 'test-widget': return state.widgetTestTime
    case 'package-widget': return state.widgetPackageTime
    case 'deliver-packages': return state.packageDeliveryTime

    case 'purchase-parts': return state.widgetPartPurchaseTime
    case 'hire-worker': return state.hireWorkerTime
    default: assertNever(state.action)
  }
}

