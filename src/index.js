import 'babel-polyfill'
//import 'isomorphic-fetch'
import React from 'react'
import { AppContainer } from 'react-hot-loader'
import { render } from 'react-dom'
import { browserHistory, hashHistory, Router } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import moment from 'moment'
import Root from './containers/root'
import configureStore from './store/configureStore'

import 'moment/locale/zh-cn'
moment.locale('zh-cn')
const rootNode = document.getElementById('root')
const store = configureStore()
const history = syncHistoryWithStore(__DESKTOP__ ? hashHistory : browserHistory, store)

render(
  <AppContainer>
    <Root store={store} history={history} />
  </AppContainer>,
  rootNode
)

// Hot Module Replacement API
if (module.hot) {
  module.hot.accept('./containers/root', () => {
    const NextRoot = require('./containers/root').default // eslint-disable-line
    render(
      <AppContainer>
        <NextRoot store={store} history={history} />
      </AppContainer>,
      rootNode
    )
  })
}