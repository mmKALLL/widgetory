import React from 'react'
import MainMenu from './main-menu/main-menu';
import Cutscene from './cutscene/cutscene';
import InGameView, { GameState } from './in-game-view/in-game-view';
import { loadGame, saveFileExists } from '../../utils/save-file-utils';

type ScreenName = 'main-menu' | 'intro' | 'in-game-widget'

export default class GameScreen extends React.Component<{}, { screenName: ScreenName }> {

  constructor(props: any) {
    super(props)
    this.state = { screenName: 'main-menu' }
  }

  startNewGame = () => {
    console.log('start intro')
    this.setState({
      screenName: 'intro'
    })
  }

  startSavedGame = () => {
    console.log('load game')
    this.setState({
      screenName: 'in-game-widget'
    })
  }

  finishIntro = () => {
    this.setState({
      screenName: 'in-game-widget'
    })
  }

  render() {
    if (this.state.screenName === 'main-menu') {
      return (
        <MainMenu startNewGame={this.startNewGame} startSavedGame={this.startSavedGame} />
      )
    } else if (this.state.screenName === 'intro') {
      return (
        <Cutscene text={['Money Match Games presents', 'The 44th Studio Esagames production', 'This game is a product of fiction.', 'Any similarity to real-world names, places, or events is purely coincidental.', 'Not suitable for children or those who are easily disturbed.']} textFadeTime={250} textScreenTime={600} bgColor='#fff' textColor='#111' endHandler={this.finishIntro} />
      )
    } else if (this.state.screenName === 'in-game-widget') {
      return (
        <InGameView initialState={saveFileExists ? loadGame() : newGameState} />
      )
    } else {
      return (
        <>
          error in GameScreen state, please post issue at https://github.com/mmKALLL/widgetry
        </>
      )
    }
  }
}

export const newGameState: GameState = {
  action: 'idle',
  money: 200,
  unlockedFeatures: {
    "order-button": true,
  },

  uncheckedOrders: 0,
  orders: 0,
  widgets: 0,
  testedWidgets: 0,
  packages: 0,
  deliveredPackages: 0,
}
