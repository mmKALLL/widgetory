import React from 'react'
import { PlayerAction } from '../game-screen/in-game-view/in-game-view';

interface Props {
  currentAction: PlayerAction
}

export default function ActionDescriptionText(props: Props) {
  return (
    <div>
      You are currently
      {
        props.currentAction === 'check-orders' ? ' checking orders' :
        props.currentAction === 'build-widget' ? ' building a widget' :
        ' idle'
      }
    </div>
  )
}
