import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import { Reducers } from '../features'
import { passportReducer } from '../passport'

export default combineReducers({
  routing         : routerReducer,
  passport        : passportReducer,
  ...Reducers
})