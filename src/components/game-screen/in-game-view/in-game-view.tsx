import React from 'react'
import FooterArea from '../../footer-area/footer-area';
import { saveGame } from '../../../utils/save-file-utils';
import Button from '../../button/button';
import ActionPanel from '../../action-panel/action-panel';

export type GameState = {
  action: PlayerAction
  money: number
  unlockedFeatures: { [key in FeatureName]?: boolean }

  uncheckedOrders: number
  orders: number
  widgets: number
  testedWidgets: number
  packages: number
  deliveredPackages: number
}

export type PlayerAction = 'idle' | 'check-orders' | 'build-widget' | 'test-widget' | 'package-widget' | 'deliver-package'

export type FeatureName = 'order-button' | 'build-button' | 'test-button' | 'package-button' | 'deliver-button'

export function isGameState(state: any): state is GameState {
  return state !== undefined &&
      state !== null &&

      typeof state.action === 'string' &&
      typeof state.money === 'number' &&
      typeof state.unlockedFeatures === 'object' &&

      typeof state.uncheckedOrders === 'number' &&
      typeof state.orders === 'number' &&
      typeof state.widgets === 'number' &&
      typeof state.testedWidgets === 'number' &&
      typeof state.packages === 'number' &&
      typeof state.deliveredPackages === 'number'
}

interface Props {
  initialState: GameState
}

export default class InGameView extends React.Component<Props, GameState> {
  constructor(props: Props) {
    super(props)
    this.state = props.initialState

    window.setInterval(() => saveGame(this.state), 5000)
    window.setTimeout(this.addOrder, 13000)
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

  render() {
    return (
      <div className='game-container'>
        <ActionPanel
            setPlayerAction={this.setPlayerAction}
            unlockedFeatures={this.state.unlockedFeatures}
        />
        <Button onClick={this.addOrder} text='Check orders' />
        <FooterArea />
      </div>
    )
  }
}
