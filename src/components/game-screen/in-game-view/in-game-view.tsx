import React from 'react'
import FooterArea from '../../footer-area/footer-area'
import { saveGame } from '../../../utils/save-file-utils'
import ActionPanel from '../../action-panel/action-panel'
import MoodHandler from '../../mood-handler/mood-handler'
import InformationPanel from '../../information-panel/information-panel'
import { DEBUG, FPS, GameState, PlayerAction } from '../../../game-logic/types'
import { nextState, paySalaries } from '../../../game-logic/game-loop'

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
        action: 'idle',
      })
    } else {
      this.setState({
        action: 'change-action',
        nextAction: newAction,
        timeSinceActionStarted: 0,
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
      <div className="game-container">
        <InformationPanel debugEnabled={DEBUG} state={this.state} />

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
