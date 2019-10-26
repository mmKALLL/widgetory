import React from 'react'
import MainMenu from '../main-menu/main-menu';
import Cutscene from '../cutscene/cutscene';
import InGameView, { GameState } from '../in-game-view/in-game-view';
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

  render() {
    if (this.state.screenName === 'main-menu') {
      return (
        <MainMenu startNewGame={this.startNewGame} startSavedGame={this.startSavedGame} />
      )
    } else if (this.state.screenName === 'intro') {
      return (
        <Cutscene text={['Money Match Games presents', 'The 44th Studio Esagames production', 'This game is a product of fiction.', 'Any similarity to real-world names, places, or events is purely coincidental.', 'Not suitable for children or those who are easily disturbed.']} textFadeTime={250} textScreenTime={600} bgColor='#fff' textColor='#111' endHandler={this.finishIntro} />
      )
    } else if (this.state.screenName === 'in-game-main') {
      return (
        <InGameView initialState={saveFileExists ? loadGame() : initialState} />
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

export const initialState: GameState = {
  stepCount: 0,
  position: 0, // Can step both forward and back
  mood: {
    overall: 40,
    r: 0,
    g: 0,
    b: 0,
  },
  time: {
    day: 0,
    second: 0,
    paused: false
  },
}
