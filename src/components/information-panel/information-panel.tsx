import React, { ReactElement } from "react"
import './information-panel.sass'
import { GameState, getActionTargetTime } from "../game-screen/in-game-view/in-game-view";
import ActionDescriptionText from "../action-description-text/action-description-text";

export function progressBar(value: number, max: number, barLength: number = 30, character: string = '#'): string {
  let progressPoints = Math.ceil(Math.max(0, Math.min(value, max)) / (max + 0.01) * barLength)
  return `【${character.repeat(progressPoints)}${' '.repeat(barLength - progressPoints)}】`
}

export default function InformationPanel(props: { debugEnabled: boolean, state: GameState }): ReactElement {

  const actionCompletionPercentage = Math.floor(props.state.timeSinceActionStarted / getActionTargetTime(props.state) * 100)


  return (
    <div className="information-panel-container">
        {/* { props.debugEnabled && <div>Current action: {props.state.action}</div> } */}

        <ActionDescriptionText currentAction={props.state.action} />
        { props.debugEnabled &&
          <div>
            Action complete:
              {/* Progress bar, percentage, then seconds left, e.g. '[###      ] 36% (4 sec)' */}
              <pre className="action-progress-bar">{progressBar(actionCompletionPercentage, 100)}</pre>
              {` ${actionCompletionPercentage}%`}
              {getActionTargetTime(props.state) < 600 * 1000 && // show time in sec if less than 10 min left; filters idle state off
                  ` (${Math.round((getActionTargetTime(props.state) - props.state.timeSinceActionStarted + 1000) / 1000)} sec)`
              }
          </div>
        }

        { props.debugEnabled && <div className="information-panel-divider"></div> }

        <div>Money: {props.state.money}</div>
        { props.debugEnabled && <div>Parts: {props.state.widgetParts}</div> }
        { props.debugEnabled && <div>Orders: {props.state.orders}</div> }
        { props.debugEnabled && <div>Widgets: {props.state.widgets}</div> }
        { props.debugEnabled && <div>Tested widgets: {props.state.testedWidgets}</div> }
        { props.debugEnabled && <div>Packages: {props.state.packages}</div> }
        { props.debugEnabled && <div>Orders fulfilled: {props.state.completedOrders}</div> }

        { props.debugEnabled && <div className="information-panel-divider"></div> }

        { props.debugEnabled && <div>widgetPartPrice: {props.state.widgetPartPrice}</div> }
        { props.debugEnabled && <div>widgetPrice: {props.state.widgetPrice}</div> }
        { props.debugEnabled && <div>timeUntilOrderCancel: {Math.floor(props.state.timeUntilOrderCancel / 1000)} sec</div> }
        {/* { props.debugEnabled && <div>unlockedFeatures: {Object.entries(props.state.unlockedFeatures).join(', ')}</div> } */}
    </div>
  )
}
