import React from 'react'
import { PlayerAction } from '../../game-logic/types'
import { assertNever } from '../../utils/utilities'

interface Props {
  currentAction: PlayerAction
}

export default function ActionDescriptionText({ currentAction }: Props) {
  return (
    <div>
      You are currently
      {
        // prettier-ignore
        currentAction === 'idle' ? ' idle' :
        currentAction === 'change-action' ? ' context switching' :
        currentAction === 'check-orders' ? ' checking orders' :
        currentAction === 'build-widget' ? ' building a widget' :
        currentAction === 'test-widget' ? ' testing a widget' :
        currentAction === 'package-widget' ? ' packaging a widget' :
        currentAction === 'deliver-packages' ? ' delivering packages' :
        currentAction === 'purchase-parts' ? ' purchasing parts' :
        currentAction === 'hire-worker' ? ' hiring workers' :
        assertNever(currentAction)
      }
    </div>
  )
}
