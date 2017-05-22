// ------------------------------------
// Actions
// ------------------------------------
import { httpServices, createAction } from 'http-services'
import * as types from './constant'
import storageService from '../services/storage'
import { getToken } from '../services/token'
import config from '../config'
import _ from 'lodash'

const { domain, apiPath } = config
const HttpServices = new httpServices(domain, apiPath)

export function initial () {
  return dispatch => {
    dispatch(createAction(types.PASSPORT_INITIAL_BEGIN, null))
    setTimeout(() => {
      return new Promise(async (resolve, reject) => {
        try {
          const auth = await storageService.getItem('auth')
          const accesstoken = _.has(auth, 'tokenkey') && auth.tokenkey
          const result = await HttpServices.POST('/accesstoken', { accesstoken })
          dispatch(createAction(types.PASSPORT_INITIAL_SUCCESS, result))
          resolve(result)
        } catch (error) {
          dispatch(createAction(types.PASSPORT_INITIAL_FAILURE, error))
          reject(error)
        }
      })
      .catch(() => {})
    }, 500)
  }
}

export function login (options) {
  return dispatch => {
    dispatch(createAction(types.PASSPORT_LOGIN_BEGIN, null))
    setTimeout(() => {
      return new Promise(async (resolve, reject) => {
        try {
          const result = await HttpServices.POST('/login', options)
          dispatch(createAction(types.PASSPORT_LOGIN_SUCCESS, result))
          resolve(result)
        } catch (error) {
          dispatch(createAction(types.PASSPORT_LOGIN_FAILURE, error))
          reject(error)
        }
      })
      .catch(() => {})
    }, 500)
  }
}

export function logout () {
  return dispatch => {
    dispatch(createAction(types.PASSPORT_LOGINOUT_BEGIN, null))
    setTimeout(() => {
      dispatch(createAction(types.PASSPORT_LOGINOUT_FINISH, null))
    }, 500)
  }
}

export function editpwd (password) {
  return dispatch => {
    dispatch(createAction(types.PASSPORT_EDITPWD_BEGIN, null))
    setTimeout(() => {
      return new Promise(async (resolve, reject) => {
        try {
          const token = getToken()
          const result = await HttpServices.POST(`/passport/editpwd`, { password, accesstoken: token })
          dispatch(createAction(types.PASSPORT_EDITPWD_SUCCESS, result))
          resolve(result)
        } catch (error) {
          dispatch(createAction(types.PASSPORT_EDITPWD_FAILURE, error))
          reject(error)
        }
      })
    }, 500)
  }
}