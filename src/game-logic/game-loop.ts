import { assertNever, sum } from '../utils/utilities'
import { DEBUG, FPS, GameState } from './types'

// create and return the next GameState based on the current one
export const nextState = (state: GameState): GameState => {
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
            ns.experience += 2
            ns.energyUsed += 2.0
          }
          if (ns.widgetParts <= 0) {
            ns.action = 'idle'
          }
          break
        case 'test-widget':
          if (ns.widgets > 0) {
            ns.testedWidgets += 1
            ns.widgets -= 1
            ns.experience += 1
            ns.energyUsed += 0.6
          }
          if (ns.widgets <= 0) {
            ns.action = 'idle'
          }
          break
        case 'package-widget':
          if (ns.testedWidgets > 0) {
            ns.packages += 1
            ns.testedWidgets -= 1
            ns.experience += 1
          }
          if (ns.testedWidgets <= 0) {
            ns.action = 'idle'
          }
          break
        case 'deliver-packages':
          if (ns.orders > 0) {
            const numberDelivered = Math.min(ns.orders, ns.packages)
            console.log(`delivering ${numberDelivered} packages`)

            ns.orders -= numberDelivered
            ns.completedOrders += numberDelivered
            ns.timeUntilOrderCancel += newOrderTime(ns.completedOrders) * numberDelivered
            ns.packages -= numberDelivered
            ns.money += numberDelivered * ns.widgetPrice
            ns.widgetPrice -= numberDelivered
            ns.experience += numberDelivered

            ns.action = 'idle'
          }
          break
        case 'purchase-parts':
          if (ns.money >= ns.widgetPartPrice) {
            ns.widgetParts += 1
            ns.money -= ns.widgetPartPrice
            ns.experience += 1
          }
          if (ns.money < ns.widgetPartPrice) {
            ns.action = 'idle'
          }
          break
        case 'hire-worker':
          if (ns.money >= ns.workerHourlySalary * 8) {
            ns.unassignedWorkers += 1
            ns.experience += 6
          }
          if (ns.money < ns.workerHourlySalary * 8) {
            ns.action = 'idle'
          }
          break
        default:
          assertNever(ns.action)
      }
    }
  }

  // update cancellations
  ns.timeUntilOrderCancel -= 1000 / FPS
  if (ns.timeUntilOrderCancel < 0) {
    if (ns.orders > 0) {
      ns.orders -= 1
      // ns.money -= ns.widgetPrice // TODO: Add this back once player can research "get money at time of order"
    } else {
      ns.uncheckedOrders -= 1
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
  if (ns.orders > 0 && !ns.unlockedFeatures['build-button']) {
    ns.action = 'idle'
    ns.unlockedFeatures['build-button'] = true
  }
  if (ns.widgets >= 3) {
    ns.unlockedFeatures['test-button'] = true
  }
  if (ns.testedWidgets >= 3) {
    ns.unlockedFeatures['package-button'] = true
  }
  if (ns.packages > 0) {
    ns.unlockedFeatures['deliver-button'] = true
  }
  if (ns.widgetParts === 0) {
    ns.unlockedFeatures['purchase-parts-button'] = true
  }

  if (ns.completedOrders === 7) {
    ns.unlockedFeatures['hire-worker-button'] = true
  }
  if (ns.unassignedWorkers > 0) {
    ns.unlockedFeatures['assign-worker-buttons'] = true
  }
  // if (ns.completedOrders === 16) { ns.unlockedFeatures["hire-sales-specialist-button"] = true }
  // if (ns.completedOrders === 40) { ns.unlockedFeatures["hire-consultant-button"] = true }

  return ns
}

// called every minute to pay salaries to workers
export const paySalaries = (state: GameState): GameState => {
  const ns: GameState = { ...state } // newState; shallow copy
  ns.money -= ((ns.unassignedWorkers + getAssignedWorkerAmount(ns)) * ns.workerHourlySalary) / 60
  return ns
}

const getAssignedWorkerAmount = (state: GameState): number => {
  return sum(Object.values(state.assignedWorkers).map((v) => v ?? 0))
}

// Return time between orders in milliseconds
const newOrderTime = (deliveredPackages: number): number => {
  return (25 * 1000 * 40) / (deliveredPackages + 40)
}

const newTimeUntilOrderCancel = (deliveredPackages: number, outstandingOrders: number): number => {
  return (120 * 1000 * 10000) / (deliveredPackages + 10000) / Math.pow(outstandingOrders + 1, 0.7) // ~120s divided by orders until lategame
}

export const getActionTargetTime = (state: GameState): number => {
  // prettier-ignore
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

// Returns a ["remaining exp needed until next level", "total exp needed this level"] tuple
export function experienceToNextLevel({ level }: Pick<GameState, 'level'>): number {
  return Math.pow(level + 9, 2) // 100, 121, 144, ...
}
