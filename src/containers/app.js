import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import '../styles/index.scss'
import { passportActions, PassportLogin } from '../passport'
import { FontAwesome } from '../components'
import { CoreLayout } from '../layouts'

@connect (
  state => state,
  dispatch => ({
    actions: bindActionCreators({...passportActions}, dispatch)
  })
)
export default class App extends Component {

  componentDidMount () {
    this.props.actions.initial()
  }
  
  render () {
    const { children, passport } = this.props
    if (passport.initialPending || passport.logoutPenging) {
      return (
        <div className={'initial-wraper'}>
          <FontAwesome 
            className={'loading'} 
            type={'spinner'} 
            animated={'spin'} 
            larger={'4x'} />
        </div>
      )
    }
    return passport.auth 
      ? children 
      : <PassportLogin />
  }
}