import React, { ReactElement } from "react"
import './action-button.sass'
import Button from "../button/button";

export default function ActionButton(props: { text: string, subtext: string, onClick: () => void }): ReactElement {
  return (
    <span className="action-button-container">
      <Button text={props.text} onClick={props.onClick} className="button primary-action-button" />
      {props.subtext.split('\n').map(item => <span className="action-button-subtext">{item}</span>)}
    </span>
  )
}
