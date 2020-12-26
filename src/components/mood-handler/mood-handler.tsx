import React from 'react'
import { Color, Mood } from '../../types'

interface Props {
  mood: Mood
}

export default class MoodHandler extends React.Component<Props> {
  private TEXT_COLOR_SWITCH_THRESHOLD: number = 137
  private TEXT_COLOR_DARK: string = '#111'
  private TEXT_COLOR_LIGHT: string = '#eee'

  // Add overall mood to RGB values
  private moodToRGB(mood: Mood): Color {
    return {
      r: mood.overall + mood.r,
      g: mood.overall + mood.g,
      b: mood.overall + mood.b,
    }
  }

  // Calculate text color based on background color. Need to provide enough contrast.
  private textCSSColor(color: Color): string {
    if (this.colorBrightness(color) < this.TEXT_COLOR_SWITCH_THRESHOLD) {
      return this.TEXT_COLOR_LIGHT
    } else {
      return this.TEXT_COLOR_DARK
    }
  }

  // Return brightness of color in the HSP space; range 0-255.
  // http://alienryderflex.com/hsp.html
  private colorBrightness(color: Color): number {
    return Math.sqrt(0.299 * color.r * color.r + 0.587 * color.g * color.g + 0.114 * color.b * color.b);
  }

  // Returns a CSS parseable RGB color.
  private colorToCSS(color: Color): string {
    const r = Math.floor(color.r)
    const g = Math.floor(color.g)
    const b = Math.floor(color.b)
    return `rgb(${r},${g},${b})`
  }

  render() {
    const mood = this.props.mood
    const color = this.moodToRGB(mood)
    const elem = document.documentElement
    const bgCSSColor = this.colorToCSS(color)
    const textCSSColor = this.textCSSColor(color)
    elem.style.setProperty("--mood-background-color", bgCSSColor)
    elem.style.setProperty("--mood-text-color", textCSSColor)

    return (
      <>
      </>
    )
  }
}
