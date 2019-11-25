import React from 'react'
import './main-menu.sass'
import FooterArea from '../../footer-area/footer-area'
import Button from '../../button/button';
import { saveFileExists } from '../../../utils/save-file-utils';
import { getRandomMantra, getInitialMantra } from '../../../utils/text-utils';

interface Props {
  startNewGame: () => void
  startSavedGame: () => void
}

export default function MainMenu(props: Props) {
  return (
    <div className="MainMenu">
      <h1>Widgetory</h1>

      <MainMenuControls startNewGame={props.startNewGame} startSavedGame={props.startSavedGame} />
      <FooterArea />
    </div>
  );
}

function MainMenuControls(props: Props) {
  if (saveFileExists()) {
    return (
      <>
        <div className="text-padded">
          {getRandomMantra()}
        </div>
        <Button className="button primary-action-button title-button" onClick={props.startSavedGame} text="Continue building" />
      </>
    )
  }
  else return (
    <>
      <div className="text-padded">
        {getInitialMantra()}
      </div>
      <Button className="button primary-action-button title-button" onClick={props.startNewGame} text="Start building" />
    </>
  )

  // {/* <button class="button disabled primary-action-button title-button" id="language-button" onClick={props.changeLanguage('jp')}>日本語</button> */}
}
