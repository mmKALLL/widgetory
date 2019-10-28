import React from 'react'
import FooterArea from '../../footer-area/footer-area';
import { saveGame } from '../../../utils/save-file-utils';
import Button from '../../button/button';
import MoodHandler, { Mood } from '../../mood-handler/mood-handler';

export type GameState = {
  action: PlayerAction
  mood: Mood
  money: number

  uncheckedOrders: number
  orders: number
  widgets: number
  testedWidgets: number
  packages: number
  deliveredPackages: number
}

export type PlayerAction = 'idle' | 'check-orders' | 'build-widget' | 'test-widget' | 'package-widget' | 'deliver-package'

export type Feature = 'order-button' | 'build-button' | 'test-button' | 'package-button' | 'deliver-button'

interface Props {
  initialState: GameState
}

export default class InGameView extends React.Component<Props, GameState> {
  constructor(props: Props) {
    super(props)
    this.state = props.initialState

    window.setInterval(() => saveGame(this.state), 10000)
    window.setTimeout(this.addOrder, 16000)
  }

  addOrder = () => {
    this.setState((prevState, _) => {
      orders: prevState.orders + 1
    })
    window.setTimeout(this.addOrder, this.newOrderTime())
  }

  // Return time between orders in milliseconds
  newOrderTime = (): number => {
    return 300000 / (deliveredPackages + 10)
  }

  render() {
    return (
      <div className='game-container'>
        {/* <StatusArea stepCount={this.state.stepCount} position={this.state.position} /> */}
        {/* <ActionPanel
            takeStepHandler={(steps) => this.setState((state) => ({
              stepCount: state.stepCount + Math.abs(steps),
              position: state.position + steps
            }))}
            steps={this.state.stepCount}
            /> */}
        <Button onClick={this.addOrder} text='Check orders' />
        <FooterArea />
        <MoodHandler mood={this.state.mood} />
      </div>
    )
  }
}
