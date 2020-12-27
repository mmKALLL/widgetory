// Various game state and handling related typings for the project

export const FPS = 50
export const DEBUG = true

export type Mood = Color & {
  overall: number // 0-155 for Overall, 0-100 for RGB values
}

export type Color = {
  r: number // 0-255
  g: number // 0-255
  b: number // 0-255
}

export type GameState = {
  action: PlayerAction
  money: number
  experience: number
  level: number
  mood: Mood
  unlockedFeatures: { [key in FeatureName]?: boolean }

  timeToNextOrder: number // time to add an unchecked order in milliseconds
  timeUntilOrderCancel: number
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
  widgetPartPurchaseTime: number
  hireWorkerTime: number

  widgetPrice: number
  widgetPartPrice: number

  unassignedWorkers: number
  assignedWorkers: { [key in PlayerAction]?: number }
  workerHappiness: number // TODO: consider more deeply what goes into this
  workerHourlySalary: number
  workerSpeed: number

  consultantLevel: number
  salesLevel: number
  hrSpecialists: number
  workerManagers: number
  companyDirectors: number // CEO, CTO, CXO, etc

  energyUsed: number
  environmentImpact: number // co2 tons released/captured in total
  stockPrice: number
}

// action names other than 'idle' should have a verb and noun, in imperative and base singular/plural form
export type PlayerAction =
  | 'idle'
  | 'change-action'
  | 'check-orders'
  | 'build-widget'
  | 'test-widget'
  | 'package-widget'
  | 'deliver-packages'
  | 'purchase-parts'
  | 'hire-worker'

export type FeatureName =
  | 'order-button'
  | 'build-button'
  | 'test-button'
  | 'package-button'
  | 'deliver-button'
  | 'purchase-parts-button'
  | 'hire-worker-button'
  | 'assign-worker-buttons'
  | 'hire-office-assistant-button'
  | 'hire-sales-specialist-button'
  | 'hire-consultant-button'
  | 'hire-hr-specialist-button'
  | 'hire-worker-manager-button'
  | 'hire-ceo-button'

export const newGameState: GameState = {
  action: 'idle',
  money: 40000, // in something similar to 2019 yen - i.e. USD 0.01
  experience: 0,
  level: 1,
  mood: {
    overall: 28,
    r: 0,
    g: 0,
    b: 0,
  },
  unlockedFeatures: {
    'order-button': true,
  },

  timeToNextOrder: 12 * 1000,
  timeUntilOrderCancel: 150 * 1000,
  uncheckedOrders: 0,
  orders: 0,

  widgetParts: 8,
  widgets: 0,
  testedWidgets: 0,
  packages: 0,
  completedOrders: 0,

  timeSinceActionStarted: 0,
  actionSwitchTime: 2300,
  nextAction: undefined,

  // how long it takes to finish various actions
  checkOrderTime: 3000,
  widgetBuildTime: 7000,
  widgetTestTime: 3000,
  widgetPackageTime: 1200,
  packageDeliveryTime: 12000,
  widgetPartPurchaseTime: 800,
  hireWorkerTime: 32000,

  widgetPrice: 1400,
  widgetPartPrice: 850,

  assignedWorkers: {},
  unassignedWorkers: 0,
  workerHappiness: 70, // TODO: consider more deeply what goes into this
  workerHourlySalary: 1300,
  workerSpeed: 0.2, // relative to player, increases over time and when hiring consultants (increased skills), decreases when hiring workers (communication overhead)

  consultantLevel: 0,
  salesLevel: 0,
  hrSpecialists: 0,
  workerManagers: 0,
  companyDirectors: 0, // CEO, CTO, CXO, etc

  energyUsed: 0, // kwh
  environmentImpact: 0, // co2 tons released/captured in total (4300 kwh/1000kg)
  stockPrice: 0,
}
