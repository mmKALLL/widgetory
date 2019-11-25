import React from 'react'
import MainMenu from './main-menu/main-menu';
import Cutscene from './cutscene/cutscene';
import InGameView, { newGameState } from './in-game-view/in-game-view';
import { loadGame } from '../../utils/save-file-utils';

type State = {
  screenName: 'main-menu' | 'intro'
} | {
  screenName: 'in-game-widget'
  loadSavedGame: boolean
}

export default class GameScreen extends React.Component<{}, State> {

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
    this.setState({
      screenName: 'in-game-widget',
      loadSavedGame: true,
    })
  }

  finishIntro = () => {
    this.setState({
      screenName: 'in-game-widget',
      loadSavedGame: false,
    })
  }

  render() {
    if (this.state.screenName === 'main-menu') {
      return (
        <MainMenu startNewGame={this.startNewGame} startSavedGame={this.startSavedGame} />
      )
    } else if (this.state.screenName === 'intro') {
      return (
        <Cutscene text={['Money Match Games presents', 'The 47th Studio Esagames production', 'This game is a product of fiction.', 'Any similarity to real-world names, places, or events is purely coincidental.', 'Not suitable for children or those who are easily disturbed.']} textFadeTime={250} textScreenTime={600} bgColor='#fff' textColor='#111' endHandler={this.finishIntro} />
      )
    } else if (this.state.screenName === 'in-game-widget') {
      return (
        <InGameView initialState={this.state.loadSavedGame ? loadGame() : newGameState} />
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
