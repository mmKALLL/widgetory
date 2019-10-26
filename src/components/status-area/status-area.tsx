import React from 'react'

interface Props {
  stepCount: number,
  position: number
}

export default function StatusArea(props: Props) {
  return (
    <>
      Step count: { props.stepCount }<br />
      Current position: { props.position }<br />
    </>
  )
}

