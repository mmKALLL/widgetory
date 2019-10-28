import React from 'react'
import Button from '../button/button'
import { PlayerAction, Feature } from '../game-screen/in-game-view/in-game-view';

interface Props {
  setPlayerAction: (action: PlayerAction) => void
  unlockedFeatures: { [key in Feature]: boolean }
}

export default function ActionPanel(props: Props) {
  return (
    <>
      {props.unlockedFeatures['order-button'] && <Button text="Check orders" className="button primary-action-button" onClick={props.setPlayerAction} />}
      {props.unlockedFeatures['build-button'] && <Button text="Build widget" className="button primary-action-button" onClick={() => props.takeStepHandler(-1)} />}
    </>
  )
}
