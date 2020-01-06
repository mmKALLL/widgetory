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
        props.currentAction === 'idle' ? ' idle' :
        props.currentAction === 'change-action' ? ' context switching' :
        props.currentAction === 'check-orders' ? ' checking orders' :
        props.currentAction === 'build-widget' ? ' building a widget' :
        props.currentAction === 'test-widget' ? ' testing a widget' :
        props.currentAction === 'package-widget' ? ' packaging a widget' :
        props.currentAction === 'deliver-packages' ? ' delivering packages' :
        props.currentAction === 'purchase-parts' ? ' purchasing parts' :
        ' in an unknown state'
      }
    </div>
  )
}
