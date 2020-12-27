import React from 'react'
import './button.sass'

type Props = {
  className: string | undefined
  onClick: () => void
  text: string
}

export default function Button(props: Props) {
  return (
    <>
      <button className={props.className} onClick={props.onClick}>{props.text}</button>
    </>
  );
}
