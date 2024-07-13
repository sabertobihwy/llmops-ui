// 1. timeout, 100s
import { apiPrefix, httpCode } from '@/config'
import { Message } from '@arco-design/web-vue'

const TIME_OUT = 100000
// 2. api prefix: http://localhost:5000
// 3. get post
// 4. response.json()

const baseFetchOpitons = {
  method: 'GET',
  mode: 'cors',
  credentials: 'include',
  headers: new Headers({
    'Content-Type': 'application/json',
  }),
  redirect: 'follow',
}
// fetch [param type]
type FetchOptionType = Omit<RequestInit, 'boby'> & {
  params?: Record<string, any>
  body?: BodyInit | Record<string, any> | null
}
// fetch request
const baseFetch = <T>(url: string, fetchOptions: FetchOptionType): Promise<T> => {
  const options: typeof baseFetchOpitons & FetchOptionType = Object.assign(
    {},
    baseFetchOpitons,
    fetchOptions,
  )
  // url
  let urlWithPrefix = `${apiPrefix}${url.startsWith('/') ? url : `/${url}`}`

  const { method, params, body } = options
  if (method == 'GET' && params) {
    const paramsArray: string[] = []
    Object.keys(params).forEach((key) => {
      paramsArray.push(`${key}=${encodeURIComponent(params[key])}`)
    })
    if (urlWithPrefix.search(/\?/) === -1) {
      urlWithPrefix += `?${paramsArray.join('&')}`
    } else {
      urlWithPrefix += `&${paramsArray.join('&')}`
    }
    delete options.params
  }

  if (body) {
    options.body = JSON.stringify(body)
  }
  // Promise.race(): 先返回，先结束
  return Promise.race([
    new Promise((resolve, reject) => {
      setTimeout(() => {
        reject('time out!!')
      }, TIME_OUT)
    }),
    new Promise((resolve, reject) => {
      globalThis
        .fetch(urlWithPrefix, options as RequestInit)
        .then(async (res) => {
          const json = await res.json()
          if (json.code === httpCode.success) {
            resolve(json)
          } else {
            Message.error(json.message)
            reject(new Error(json.message))
          }
        })
        .catch((err) => {
          Message.error(err.message)
          reject(err)
        })
    }),
  ]) as Promise<T>
}

export const request = <T>(url: string, options = {}) => {
  return baseFetch<T>(url, options)
}

export const get = <T>(url: string, options = {}) => {
  return request<T>(url, Object.assign({}, options, { method: 'GET' }))
}
export const post = <T>(url: string, options = {}) => {
  return request<T>(url, Object.assign({}, options, { method: 'POST' }))
}
