import { SWRConfiguration } from 'swr'
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import { setServerError, setServerNoConnection } from '../redux/serverStatus'
import { store } from '../store'
import { logout } from './authentication'
import { notificationError } from '../components/Notification'
import { MessageText } from '../utils/messages'
import {
  getFromLocalStorage,
  LocalStorageKey,
} from '../utils/localStorageUtils'

const PROTOCOL = 'http://'
const HOST = 'localhost'
const PORT = ':8000'

export const SERVER_API = PROTOCOL + HOST + PORT

export const endpoints = {
  authentication: {
    login: `${SERVER_API}/login/`,
  },
}

export enum MethodHTTP {
  GET = 'GET',
  POST = 'POST',
  DELETE = 'DELETE',
  PUT = 'PUT',
}

export interface ResponseInterface {
  message: string
  status: number
  timestamp: string
  payload: any
}

axios.defaults.timeout = 10000

export const fetchApi = async (
  url: string,
  methodApi?: MethodHTTP,
  body?: any
) => {
  const token = getFromLocalStorage(LocalStorageKey.TOKEN)
  const options: AxiosRequestConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    url: url,
    method: methodApi, // Axios default is GET
    data: body,
  }

  return axios(options)
    .then((response: AxiosResponse) => response.data)
    .then((response: ResponseInterface) =>
      response.payload.records !== undefined
        ? response.payload.records
        : response.payload
    )
    .catch((error: AxiosError<any>) => {
      if (error.response) {
        const err = new Error(error.response.data.message)
        err.name = error.response.status.toString()
        switch (error.response.status) {
          case 0:
            store.dispatch(setServerNoConnection())
            break
          case 401:
            logout(false)
            notificationError(MessageText.sessioneExpired)
            break
          case 400:
            throw err
          case 500:
            store.dispatch(setServerError(err.message))
            break
          default:
            store.dispatch(setServerError(err.message))
        }
      }
      return null
    })
}

export const swrParams: SWRConfiguration = {
  fetcher: fetchApi,
  //revalidateIfStale: false,
  //revalidateOnFocus: false,
  //revalidateOnReconnect: false,
  errorRetryCount: 5,
}
