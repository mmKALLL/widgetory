import React from 'react'
import Button from '../button/button';
import './footer-area.sass'

export default class FooterArea extends React.Component {
  constructor(props) {
    super(props)
    this.state = { liked: false }
  }

  render() {
    return(
      <div className="footer-container">
        <GameSavedText />
        <LikeButton liked={this.state.liked} onClick={() => this.setState({ liked: true })} />
        <div className="copyright-notice"> &copy; Esa Koskinen 2019 </div>
      </div>
    )
  }
}

function LikeButton(props) {
  if (props.liked) {
    return <div>You liked this!</div>
  } else {
    return <Button onClick={props.onClick} text="Like" />
  }
}

function GameSavedText(props) {
  const lastSaveTime = localStorage.getItem('lastSavedAt')
  if (typeof lastSaveTime === 'string') {
    const saveTimeDiff = Date.now() - Date.parse(lastSaveTime)
    if (saveTimeDiff < 3500) {
      return <>Game saved!</>
    }
  }
  return <></>
}
