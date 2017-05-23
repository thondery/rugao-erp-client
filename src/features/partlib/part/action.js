// ------------------------------------
// Actions
// ------------------------------------
import { httpServices, createAction } from 'http-services'
import * as types from './constant'
import config from '../../../config'
import { getToken } from '../../../services/token'

const { domain, apiPath } = config
const HttpServices = new httpServices(domain, apiPath)

export function getlist () {
  return dispatch => {
    dispatch(createAction(types.PARTLIB_PART_LIST_BEGIN, null))
    return new Promise(async (resolve, reject) => {
      try {
        const token = getToken()
        const result = await HttpServices.GET('/partlib/part', { accesstoken: token })
        dispatch(createAction(types.PARTLIB_PART_LIST_SUCCESS, result))
        resolve(result)
      } catch (error) {
        dispatch(createAction(types.PARTLIB_PART_LIST_FAILURE, error))
        reject(error)
      }
    })
  }
}

export function saveEdit (id, data) {
  return dispatch => {
    dispatch(createAction(types.PARTLIB_PART_EDIT_BEGIN, null))
    setTimeout( () => {
      return new Promise(async (resolve, reject) => {
        try {
          const token = getToken()
          const result = await HttpServices.POST(`/partlib/part/edit/${id}`, { ...data, accesstoken: token })
          dispatch(createAction(types.PARTLIB_PART_EDIT_SUCCESS, result))
          resolve(result)
        } catch (error) {
          dispatch(createAction(types.PARTLIB_PART_EDIT_FAILURE, error))
          reject(error)
        }
      })
    }, 500)
  }
}

export function saveAdd (data) {
  return dispatch => {
    dispatch(createAction(types.PARTLIB_PART_ADD_BEGIN, null))
    setTimeout( () => {
      return new Promise(async (resolve, reject) => {
        try {
          const token = getToken()
          const result = await HttpServices.POST(`/partlib/part/create`, { ...data, accesstoken: token })
          dispatch(createAction(types.PARTLIB_PART_ADD_SUCCESS, result))
          resolve(result)
        } catch (error) {
          dispatch(createAction(types.PARTLIB_PART_ADD_FAILURE, error))
          reject(error)
        }
      })
    }, 500)
  }
}

export function remove (id) {
  return dispatch => {
    dispatch(createAction(types.PARTLIB_PART_REMOVE_BEGIN, null))
    return new Promise(async (resolve, reject) => {
      try {
        const token = getToken()
        const result = await HttpServices.POST(`/partlib/part/remove`, { id, accesstoken: token })
        dispatch(createAction(types.PARTLIB_PART_REMOVE_SUCCESS, result))
        resolve(result)
      } catch (error) {
        dispatch(createAction(types.PARTLIB_PART_REMOVE_FAILURE, error))
        reject(error)
      }
    })
  }
}