import React, { useState, useEffect } from 'react'
import './cutscene.sass'

interface Props extends TextSettings {
  text: string[]
  endHandler: () => void
}

interface TextSettings {
  textScreenTime: number // milliseconds
  textFadeTime: number
  textColor: string
  bgColor: string
}

export default function Cutscene(props: Props) {
  const [textIndex, setTextIndex] = useState(0)
  const lastIndex = props.text.length

  const advanceText = () => setTextIndex(textIndex + 1)

  useEffect(() => {
    if (textIndex >= lastIndex) {
      props.endHandler()
      return
    }
    const interval = setInterval(advanceText, props.textScreenTime + props.textFadeTime * 2)
    return () => clearInterval(interval)
  })

  const currentText = () => props.text[textIndex]

  return (
    <>
      <CutsceneText text={currentText()} settings={ props } />
    </>
  )
}

function CutsceneText(props: { text: string, settings: TextSettings }) {
  return (
    <>
      <div className='cutscene-text' style={{ color: props.settings.textColor, backgroundColor: props.settings.bgColor }}>
        { props.text }
      </div>
    </>
  )
}
