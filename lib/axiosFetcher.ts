import axios, { AxiosError, AxiosResponse } from "axios"
import { Response } from "../types/response"

interface Options<T> {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH"
  data?: T
  headers?: any
}

const handleResponse = <R>(response: AxiosResponse<R>): Response<R> => {
  if (response.status >= 200 && response.status < 300) {
    return response.data as Response<R>
  } else {
    return { error: "An error occurred while fetching data" }
  }
}

const handleError = <R>(error: AxiosError): Response<R> => {
  if (error.response && error.response.status === 401) {
    return { error: "User not found" }
  } else {
    return { error: "An error occurred while fetching data" }
  }
}

export const fetcher1 = <R, T>(url?: string, options?: Options<T>): Promise<Response<R>> => {
  return axios
    .request({ url, ...options })
    .then(handleResponse)
    .catch((error) => handleError<R>(error))
}
