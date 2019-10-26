import React from 'react'
import FooterArea from '../footer-area/footer-area';
import StatusArea from '../status-area/status-area';
import ActionPanel from '../action-panel/action-panel';
import MoodHandler from '../mood-handler/mood-handler';
import { isGameState, saveGame } from '../../utils/save-file-utils';

export type GameState = {
  mood: Mood
  time: TimeState
} & PositionState

export interface PositionState {
  stepCount: number
  position: number
}

export interface TimeState {
  day: number // full in-game days passed since start
  second: number // non-pause realtime seconds passed since start of current day
  paused: boolean // pause during cutscenes, popups, when inactive, etc
}

export interface Mood {
  overall: number // 0-155. General mood level.
  r: number // 0-100. Love, passion, bonds.
  g: number // 0-100. Optimism, wellbeing, altruism.
  b: number // 0-100. Rationality, thinking, calmness.
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
        <MoodHandler mood={this.state.mood} />
      </div>
    )
  }
}
