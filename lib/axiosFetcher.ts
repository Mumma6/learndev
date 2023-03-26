import axios, { AxiosError, AxiosResponse } from "axios"
import { Response } from "../types/response"

export type HTTPMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH"

export interface Options<T> {
  method?: HTTPMethod
  data?: T
  headers?: any
}

export const getHttpOptions = <T>(data: T, method: HTTPMethod): Options<T> => {
  return {
    method,
    headers: { "Content-Type": "application/json" },
    data,
  }
}

const handleResponse = <R>(response: AxiosResponse<R>) => {
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
    console.log(error)
    return error.response?.data as Response<R>
  }
}

export const fetcher = <R, T>(url?: string, options?: Options<T>): Promise<Response<R>> => {
  return axios
    .request({ url, ...options })
    .then(handleResponse)
    .catch((error) => handleError<R>(error))
}

/*
Old fetcher


interface Response {
  error: {
    message: string
  }
  payload: any
}

// Replace this with a generic fetcher function using Axios.

export const fetcher = (...args: [string, Object]) => {
  return fetch(...args)
    .then(async (res) => {
      let payload
      try {
        if (res.status === 204) return null // 204 does not have body
        payload = await res.json()
      } catch (e) {
      }
      if (res.status === 401) {
        console.log(payload)
        return { error: payload?.error || "Email or password is incorrect" }
      }
      if (res.ok) {
        return payload
      } else {
        return { error: payload?.error || payload?.message } || new Error("Something went wrong")
      }
    })
    .catch((e) => {
      console.log(e, " error catch")
    })
}

*/
