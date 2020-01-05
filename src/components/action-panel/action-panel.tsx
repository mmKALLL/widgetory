import React, { ReactElement } from 'react'
import { PlayerAction, FeatureName } from '../game-screen/in-game-view/in-game-view';
import ActionButton from '../action-button/action-button';

interface Props {
  orders: number
  parts: number
  widgets: number
  testedWidgets: number
  packages: number
  completedOrders: number

  partPrice: number

  setPlayerAction: (action: PlayerAction) => void
  unlockedFeatures: { [key in FeatureName]?: boolean }
}

export default function ActionPanel(props: Props): ReactElement {
  return (
    <>
      {props.unlockedFeatures['order-button'] && <ActionButton text="Check orders" subtext="" onClick={() => props.setPlayerAction('check-orders')} />}
      {props.unlockedFeatures['build-button'] && <ActionButton text="Build widgets" subtext={`Parts: ${props.parts}\nWidgets: ${props.widgets}`} onClick={() => props.setPlayerAction('build-widget')} />}
      {props.unlockedFeatures['test-button'] && <ActionButton text="Test widgets" subtext={`Tested widgets: ${props.testedWidgets}`} onClick={() => props.setPlayerAction('test-widget')} />}
      {props.unlockedFeatures['package-button'] && <ActionButton text="Package widgets" subtext={`Packages: ${props.packages}`} onClick={() => props.setPlayerAction('package-widget')} />}
      {props.unlockedFeatures['deliver-button'] && <ActionButton text="Deliver packages" subtext={`Completed orders: ${props.completedOrders}`} onClick={() => props.setPlayerAction('deliver-packages')} />}
      {props.unlockedFeatures['purchase-parts-button'] && <ActionButton text="Purchase parts" subtext={`Price/unit: ${props.partPrice}`} onClick={() => props.setPlayerAction('purchase-parts')} />}
    </>
  )
}
