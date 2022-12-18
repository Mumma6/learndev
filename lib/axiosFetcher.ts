import axios from "axios"

interface Options<T> {
  method?: "GET" | "POST" | "PUT" | "DELETE"
  data?: T
  headers?: any
}

interface Response<R> {
  message?: string
  error?: string
  payload?: R
}

export const fetcher1 = <R, T>(url: string, options: Options<T>): Promise<Response<R>> => {
  return axios.request({ url, ...options }).then((response) => response.data)
}
