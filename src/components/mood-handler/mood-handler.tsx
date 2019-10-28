import React from 'react'

export type Mood = {
  overall: number
  r: number
  g: number
  b: number
}

interface Props {
  mood: Mood
}

export default class MoodHandler extends React.Component<Props> {
  private TEXT_COLOR_SWITCH_THRESHOLD: number = 137
  private TEXT_COLOR_DARK: string = '#111'
  private TEXT_COLOR_LIGHT: string = '#eee'

  // Add overall mood to RGB values
  private backgroundColor(mood: Mood): Mood {
    return {
      overall: 0,
      r: mood.overall + mood.r,
      g: mood.overall + mood.g,
      b: mood.overall + mood.b,
    }
  }

  private textColor(mood: Mood): string {
    if (this.colorBrightness(mood) < this.TEXT_COLOR_SWITCH_THRESHOLD) {
      return this.TEXT_COLOR_LIGHT
    } else {
      return this.TEXT_COLOR_DARK
    }
  }

  // Return brightness of color in the HSP space; range 0-255.
  // http://alienryderflex.com/hsp.html
  private colorBrightness(mood: Mood): number {
    return Math.sqrt(0.299 * mood.r * mood.r + 0.587 * mood.g * mood.g + 0.114 * mood.b * mood.b);
  }

  // Returns a CSS parseable RGB color.
  private moodToCSSColor(mood: Mood): string {
    const r = Math.floor(mood.r)
    const g = Math.floor(mood.g)
    const b = Math.floor(mood.b)
    return `rgb(${r},${g},${b})`
  }

  render() {
    const mood = this.props.mood
    const elem = document.documentElement
    const bgCSSColor = this.moodToCSSColor(this.backgroundColor(mood))
    const textCSSColor = this.textColor(mood)
    elem.style.setProperty("--mood-background-color", bgCSSColor)
    elem.style.setProperty("--mood-text-color", textCSSColor)

    return (
      <>
      </>
    )
  }
}
