import React, { ReactElement } from 'react'
import './action-button.sass'
import Button from '../button/button'

export default function ActionButton(props: {
  text: string
  subtext: string[]
  onClick: () => void
}): ReactElement {
  return (
    <span className="action-button-container">
      <Button text={props.text} onClick={props.onClick} className="button primary-action-button" />
      {props.subtext.map((item) => (
        <span key={item} className="action-button-subtext">
          {item}
        </span>
      ))}
    </span>
  )
}
