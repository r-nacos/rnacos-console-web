import { type AxiosInstance, type AxiosRequestConfig, type AxiosPromise, type AxiosResponse, AxiosHeaders } from 'axios'
import axios from 'axios'
import { toast } from '@/utils'

export interface AxiosError<T = any> extends Error {
  config: AxiosRequestConfig
  code?: string
  request?: any
  response?: AxiosResponse<T>
}

const cfg = {
  baseURL: '/',
  timeout: 100000,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  loading: true,
}

const instance: AxiosInstance = axios.create(cfg)

instance.interceptors.request.use(
  (config: AxiosRequestConfig): any => {
    // const headers = new AxiosHeaders()
    // headers.set('accessToken', 'Bearer token')
    // if (headers.get('accessToken')) {
    //   config.headers = headers
    // }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  },
)

instance.interceptors.response.use((response: AxiosResponse) => {
  const basePath = import.meta.env.VITE_APP_WEB_ROOT_PATH
  if (response.headers['No-Logig'] === '1' || response.headers['no-login'] === '1') {
    let url = basePath !== '/' ? `${basePath}/p/login` : '/p/login'
    url += '?redirect_url=' + encodeURIComponent(location.pathname + location.search)
    location.href = url
  }
  return response
})

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
}

interface HttpResponse extends AxiosResponse {
  code: number
  data: any
  message: string
}

const request = (cfg: AxiosRequestConfig): Promise<HttpResponse> => {
  return instance({
    ...cfg,
  })
}

const getJSON = (url: string, cfg?: AxiosRequestConfig): Promise<HttpResponse> => {
  return request({
    url: url,
    method: HttpMethod.GET,
    ...cfg,
  })
}

const postJSON = (url: string, cfg?: AxiosRequestConfig): Promise<HttpResponse> => {
  return request({
    url: url,
    method: HttpMethod.POST,
    ...cfg,
  })
}
const putJSON = (url: string, cfg?: AxiosRequestConfig): Promise<HttpResponse> => {
  return request({
    url: url,
    method: HttpMethod.PUT,
    ...cfg,
  })
}

const deleteJSON = (url: string, cfg?: AxiosRequestConfig): Promise<HttpResponse> => {
  return request({
    url: url,
    method: HttpMethod.DELETE,
    ...cfg,
  })
}
export { instance, getJSON, postJSON, putJSON, deleteJSON, request }
