// ------------------------------------
// Reducer
// ------------------------------------
import { statusToError, getStatusError, createReducer } from 'http-services'
import * as types from './constant'

const initialState = {

}

const ACTION_HANDLERS = {

}

export default (state = initialState, action) => createReducer(state, action, ACTION_HANDLERS)