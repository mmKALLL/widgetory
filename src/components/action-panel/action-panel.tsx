import React from 'react'
import Button from '../button/button'

interface Props {
  takeStepHandler: (steps: number) => void
  steps: number
}

export default function ActionPanel(props: Props) {
  return (
    <>
      <Button text="Step forward" className="button primary-action-button" onClick={() => props.takeStepHandler(1)} />
      {props.steps < 10 ? null : <Button text="Take a step back" className="button primary-action-button" onClick={() => props.takeStepHandler(-1)} />}
    </>
  )
}
