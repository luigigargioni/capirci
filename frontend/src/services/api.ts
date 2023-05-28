import { BareFetcher, Key, Middleware, SWRConfiguration, SWRHook } from 'swr'
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import { toast } from 'react-toastify'
import { MessageText } from 'utils/messages'

export enum MethodHTTP {
  GET = 'GET',
  POST = 'POST',
  DELETE = 'DELETE',
  PUT = 'PUT',
}

export interface ResponseInterface {
  msg: string
  timestamp: string
  status: number
  payload: any
}

axios.defaults.timeout = 10000

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
    url,
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
            toast.error(MessageText.noConnection)
            break
          case 400:
            toast.error(err.message)
            throw err
          case 500:
            toast.error(err.message)
            break
          default:
            toast.error(err.message)
        }
      }
      return null
    })
}

const disableCache: Middleware = (useSWRNext: SWRHook) => {
  return <Data = any, Error = any>(
    key: Key,
    fetcher: BareFetcher<Data> | null,
    config: SWRConfiguration<Data, Error, BareFetcher<Data>>
  ) => {
    const swr = useSWRNext(key, fetcher, config)
    const { data, isValidating } = swr
    return { ...swr, data: isValidating ? undefined : data }
  }
}

export const swrParams: SWRConfiguration = {
  fetcher: fetchApi,
  revalidateIfStale: true,
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  revalidateOnMount: true,
  refreshWhenHidden: true,
  refreshWhenOffline: true,
  shouldRetryOnError: false,
  focusThrottleInterval: 0,
  errorRetryCount: 0,
  use: [disableCache],
}
