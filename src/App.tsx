import React, { Component } from 'react'
import './App.sass'
import GameScreen from './components/game-screen/game-screen';

export default class App extends Component<{}, {}> {
  render() {
    return (
      <div className="App">
        <link href="https://fonts.googleapis.com/css?family=Charm|Gloria+Hallelujah|Noto+Sans+JP|Roboto+Slab" rel="stylesheet"></link>
        <GameScreen />
      </div>
    )
  }
}

