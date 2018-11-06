import React from 'react'
import ReactDOM from 'react-dom'
import Sequencer from './Sequencer'
import './index.scss'

import * as serviceWorker from './serviceWorker'

ReactDOM.render(<Sequencer />, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.register()
