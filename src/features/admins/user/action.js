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
    dispatch(createAction(types.ADMINS_USER_LIST_BEGIN, null))
    return new Promise(async (resolve, reject) => {
      try {
        const token = getToken()
        const result = await HttpServices.GET('/admins/user', { accesstoken: token })
        dispatch(createAction(types.ADMINS_USER_LIST_SUCCESS, result))
        resolve(result)
      } catch (error) {
        dispatch(createAction(types.ADMINS_USER_LIST_FAILURE, error))
        reject(error)
      }
    })
  }
}

export function saveEdit (uid, data) {
  return dispatch => {
    dispatch(createAction(types.ADMINS_USER_EDIT_BEGIN, null))
    setTimeout( () => {
      return new Promise(async (resolve, reject) => {
        try {
          const token = getToken()
          const result = await HttpServices.POST(`/admins/user/edit/${uid}`, { ...data, accesstoken: token })
          dispatch(createAction(types.ADMINS_USER_EDIT_SUCCESS, result))
          resolve(result)
        } catch (error) {
          dispatch(createAction(types.ADMINS_USER_EDIT_FAILURE, error))
          reject(error)
        }
      })
    }, 500)
  }
}

export function saveAdd (data) {
  return dispatch => {
    dispatch(createAction(types.ADMINS_USER_ADD_BEGIN, null))
    setTimeout( () => {
      return new Promise(async (resolve, reject) => {
        try {
          const token = getToken()
          const result = await HttpServices.POST(`/admins/user/create`, { ...data, accesstoken: token })
          dispatch(createAction(types.ADMINS_USER_ADD_SUCCESS, result))
          resolve(result)
        } catch (error) {
          dispatch(createAction(types.ADMINS_USER_ADD_FAILURE, error))
          reject(error)
        }
      })
    }, 500)
  }
}

export function remove (uid) {
  return dispatch => {
    dispatch(createAction(types.ADMINS_USER_REMOVE_BEGIN, null))
    return new Promise(async (resolve, reject) => {
      try {
        const token = getToken()
        const result = await HttpServices.POST(`/admins/user/remove`, { uid, accesstoken: token })
        dispatch(createAction(types.ADMINS_USER_REMOVE_SUCCESS, result))
        resolve(result)
      } catch (error) {
        dispatch(createAction(types.ADMINS_USER_REMOVE_FAILURE, error))
        reject(error)
      }
    })
  }
}