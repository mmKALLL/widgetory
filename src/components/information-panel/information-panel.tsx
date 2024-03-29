import React, { ReactElement } from 'react'
import './information-panel.sass'
import ActionDescriptionText from '../action-description-text/action-description-text'
import { GameState } from '../../game-logic/types'
import { formatPrice } from '../../utils/utilities'
import { getActionTargetTime, experienceToNextLevel } from '../../game-logic/game-loop'

export function progressBar(
  value: number,
  max: number,
  barLength: number = 30,
  character: string = '#'
): string {
  let progressPoints = Math.ceil((Math.max(0, Math.min(value, max)) / (max + 0.01)) * barLength)
  return `【${character.repeat(progressPoints)}${' '.repeat(barLength - progressPoints)}】`
}

export default function InformationPanel(props: { debugEnabled: boolean; state: GameState }): ReactElement {
  const exp = props.state.experience
  const expNeeded = experienceToNextLevel(props.state)
  const actionCompletionPercentage = Math.floor(
    (props.state.timeSinceActionStarted / getActionTargetTime(props.state)) * 100
  )

  return (
    <div className="information-panel-container">
      <ActionDescriptionText currentAction={props.state.action} />

      <div className={props.state.unlockedFeatures['build-button'] ? 'exp-bar' : 'hidden'}>
        Experience:{' '}
        <pre className="action-progress-bar">{progressBar(props.state.experience, expNeeded)}</pre>
        {`${exp} / ${expNeeded} (Level ${props.state.level})`}
      </div>

      <div className={props.state.unlockedFeatures['test-button'] ? 'action-progress-container' : 'hidden'}>
        Progress:
        {/* Progress bar, percentage, then seconds left, e.g. '[###      ] 36% (4 sec)' */}
        <pre className="action-progress-bar">{progressBar(actionCompletionPercentage, 100)}</pre>
        {` ${actionCompletionPercentage}%`}
        {
          // prettier-ignore
          getActionTargetTime(props.state) < 600 * 1000 && // show time in sec if less than 10 min left; filters idle state off
                ` (${Math.floor((getActionTargetTime(props.state) - props.state.timeSinceActionStarted + 1000) / 1000)} sec)`
        }
      </div>

      <div
        className={props.state.unlockedFeatures['build-button'] ? 'information-panel-divider' : 'hidden'}
      ></div>

      <div className={props.state.unlockedFeatures['build-button'] ? 'money-text' : 'hidden'}>
        Money: {formatPrice(props.state.money)}
      </div>
      <div className={props.state.consultantLevel >= 2 ? 'order-cancel-text' : 'hidden'}>
        Time until order cancel: {Math.floor(props.state.timeUntilOrderCancel / 1000)} sec
      </div>
      <div
        className={
          props.state.unlockedFeatures['purchase-parts-button'] ? 'widget-part-price-text' : 'hidden'
        }
      >
        Widget part purchase price: {formatPrice(props.state.widgetPartPrice)}
      </div>
      <div className={props.state.unlockedFeatures['deliver-button'] ? 'widget-price-text' : 'hidden'}>
        Widget sell price: {formatPrice(props.state.widgetPrice)}
      </div>
    </div>
  )
}
