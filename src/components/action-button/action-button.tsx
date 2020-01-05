import React, { ReactElement } from "react"
import Button from "../button/button";

export default function ActionButton(props: { text: string, subtext: string, onClick: () => void }): ReactElement {
  return (
    <span className="action-button-container">
      <Button text={props.text} onClick={props.onClick} className="button primary-action-button" />
      <span className="action-button-subtext">{props.subtext}</span>
    </span>
  )
}
