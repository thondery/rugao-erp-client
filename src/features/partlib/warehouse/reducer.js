// ------------------------------------
// Reducer
// ------------------------------------
import { statusToError, getStatusError, createReducer } from 'http-services'
import * as types from './constant'
import _ from 'lodash'

const initialState = {
  getListPending: false,
  getListError: -1,
  getListMessage: null,
  listData: null,
  addPending: false,
  addError: -1,
  addMessage: null,
  parts: null
}

const ACTION_HANDLERS = {
  [types.PARTLIB_WAREHOUSE_LIST_BEGIN]: (state, action) => {
    return {
      ...state,
      getListPending: false,
      getListError: -1,
      getListMessage: null,
      listData: null,
    }
  },
  [types.PARTLIB_WAREHOUSE_LIST_SUCCESS]: (state, action) => {
    const { payload } = action
    const { data, status } = payload
    return {
      ...state,
      ...statusToError(payload, 'getListError', 'getListMessage'),
      getListPending: false,
      listData: data ? data.warehouse : null,
    }
  },
  [types.PARTLIB_WAREHOUSE_LIST_FAILURE]: (state, action) => {
    const { error } = action
    const status = getStatusError(error)
    return {
      ...state,
      ...statusToError({status}, 'getListError', 'getListMessage'),
      getListPending: false,
      listData: null,
    }
  },
  [types.PARTLIB_WAREHOUSE_ADD_BEGIN]: (state, action) => {
    return {
      ...state,
      addPending: true,
      addError: -1,
      addMessage: null
    }
  },
  [types.PARTLIB_WAREHOUSE_ADD_SUCCESS]: (state, action) => {
    const { payload } = action
    const { data, status } = payload
    return {
      ...state,
      ...statusToError(payload, 'addError', 'addMessage'),
      addPending: false,
      listData: createItem(data, status, state.listData)
    }
  },
  [types.PARTLIB_WAREHOUSE_ADD_FAILURE]: (state, action) => {
    const { error } = action
    const status = getStatusError(error)
    return {
      ...state,
      ...statusToError({status}, 'addError', 'addMessage'),
      addPending: false
    }
  },
}

export default (state = initialState, action) => createReducer(state, action, ACTION_HANDLERS)

function createItem (data, status, listData) {
  if (status.code !== 0) return listData
  if (!listData) listData = []
  listData.push(data)
  return listData
}