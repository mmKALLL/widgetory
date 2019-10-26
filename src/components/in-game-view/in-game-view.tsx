import React from 'react'
import FooterArea from '../footer-area/footer-area';
import StatusArea from '../status-area/status-area';
import ActionPanel from '../action-panel/action-panel';
import MoodHandler from '../mood-handler/mood-handler';
import { isGameState, saveGame } from '../../utils/save-file-utils';

export type GameState = {
  ordersPending: 0,
  action: PlayerAction,
}

type PlayerAction = 'idle' | 'check-orders' | 'build-widget' | 'test-widget' | 'package-widget' | 'deliver-package'

export const newGameState = {
  ordersPending: 0,
  action: 'idle'
}

interface Props {
  initialState: GameState
}

export default class InGameView extends React.Component<Props, GameState> {
  constructor(props: Props) {
    super(props)
    this.state = props.initialState

    window.setInterval(() => saveGame(this.state), 10000)
  }

  render() {
    return (
      <div className='game-container'>
        <StatusArea stepCount={this.state.stepCount} position={this.state.position} />
        <ActionPanel
            takeStepHandler={(steps) => this.setState((state) => ({
              stepCount: state.stepCount + Math.abs(steps),
              position: state.position + steps
            }))}
            steps={this.state.stepCount}
            />
        <FooterArea />
      </div>
    )
  }
}
