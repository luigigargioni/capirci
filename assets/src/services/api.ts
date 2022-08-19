import { SWRConfiguration } from 'swr'
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import { setServerError, setServerNoConnection } from '../redux/serverStatus'
import { store } from '../store'
import { notificationError } from '../components/Notification'

const PROTOCOL = 'http://'
const HOST = 'localhost'
const PORT = ':8000'
const API = '/api'

const SERVER = PROTOCOL + HOST + PORT
const SERVER_API = SERVER + API

const AUTH_API = `${SERVER}`
const HOME_API = `${SERVER_API}/home`
const GRAPHIC_API = `${SERVER_API}/graphic`
const CHAT_API = `${SERVER_API}/chat`

export const endpoints = {
  authentication: {
    login: `${AUTH_API}/login/`,
  },
  home: {},
  graphic: {
    actions: `${GRAPHIC_API}/getActionList/`,
    objects: `${GRAPHIC_API}/getObjectList/`,
    locations: `${GRAPHIC_API}/getLocationList/`,
    tasks: `${GRAPHIC_API}/getTaskList/`,
  },
  chat: {},
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

const getToken = () =>
  document.getElementsByName('csrfmiddlewaretoken')[0]?.getAttribute('value')

axios.defaults.timeout = 10000

export const fetchApi = async (
  url: string,
  methodApi?: MethodHTTP,
  body?: any
) => {
  const token = getToken()
  const options: AxiosRequestConfig = {
    headers: { 'Content-Type': 'multipart/form-data' },
    url: url,
    method: methodApi, // Axios default is GET
    data: {
      ...body,
      ...(token && { csrfmiddlewaretoken: token }),
    },
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
        const err = new Error(error.response.data?.message || 'No connection')
        err.name = error.response.status.toString()
        switch (error.response.status) {
          case 0:
            store.dispatch(setServerNoConnection())
            break
          case 400:
            notificationError(err.message)
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
