import React, { ReactElement } from 'react'
import { PlayerAction, FeatureName } from '../game-screen/in-game-view/in-game-view';
import ActionButton from '../action-button/action-button';

interface Props {
  orders: number
  setPlayerAction: (action: PlayerAction) => void
  unlockedFeatures: { [key in FeatureName]?: boolean }
}

export default function ActionPanel(props: Props): ReactElement {
  return (
    <>
      {props.unlockedFeatures['order-button'] && <ActionButton text="Check orders" subtext="" onClick={() => props.setPlayerAction('check-orders')} />}
      {props.unlockedFeatures['build-button'] && <ActionButton text="Build widget" subtext={`Orders: ${props.orders}`} onClick={() => props.setPlayerAction('build-widget')} />}
    </>
  )
}
