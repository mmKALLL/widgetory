import React from 'react'
import Button from '../button/button'
import { PlayerAction, FeatureName } from '../game-screen/in-game-view/in-game-view';

interface Props {
  setPlayerAction: (action: PlayerAction) => void
  unlockedFeatures: { [key in FeatureName]?: boolean }
}

export default function ActionPanel(props: Props) {
  return (
    <>
      {props.unlockedFeatures['order-button'] && <Button text="Check orders" className="button primary-action-button" onClick={() => props.setPlayerAction('check-orders')} />}
      {props.unlockedFeatures['build-button'] && <Button text="Build widget" className="button primary-action-button" onClick={() => props.setPlayerAction('build-widget')} />}
    </>
  )
}
