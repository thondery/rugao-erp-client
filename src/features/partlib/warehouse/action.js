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
    dispatch(createAction(types.PARTLIB_WAREHOUSE_LIST_BEGIN, null))
    return new Promise(async (resolve, reject) => {
      try {
        const token = getToken()
        const result = await HttpServices.GET('/partlib/warehouse', { accesstoken: token })
        dispatch(createAction(types.PARTLIB_WAREHOUSE_LIST_SUCCESS, result))
        resolve(result)
      } catch (error) {
        dispatch(createAction(types.PARTLIB_WAREHOUSE_LIST_FAILURE, error))
        reject(error)
      }
    })
  }
}

export function saveAdd (data) {
  return dispatch => {
    dispatch(createAction(types.PARTLIB_WAREHOUSE_ADD_BEGIN, null))
    setTimeout( () => {
      return new Promise(async (resolve, reject) => {
        try {
          const token = getToken()
          const result = await HttpServices.POST(`/partlib/warehouse/create`, { ...data, accesstoken: token })
          dispatch(createAction(types.PARTLIB_WAREHOUSE_ADD_SUCCESS, result))
          resolve(result)
        } catch (error) {
          dispatch(createAction(types.PARTLIB_WAREHOUSE_ADD_FAILURE, error))
          reject(error)
        }
      })
    }, 500)
  }
}