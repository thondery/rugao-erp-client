import React, { Component, PropTypes } from 'react'
import { Provider } from 'react-redux'
import { Router } from 'react-router'
import routeConfig from '../store/routeConfig'

export default class Root extends Component {
  static propTypes = {
    history : PropTypes.object.isRequired,
    store  : PropTypes.object.isRequired
  }

  shouldComponentUpdate () {
    return false
  }

  render () {
    const { store, history } = this.props
    return (
      <Provider key={Math.random()} store={store}>
        <Router history={history} routes={routeConfig} />
      </Provider>
    )
  }
}