import axios, { type AxiosError, type AxiosResponse } from "axios"
import { type Response } from "../types/response"
import { pipe } from "fp-ts/function"
import * as TE from "fp-ts/TaskEither"

export type HTTPMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH"

export interface Options<T> {
  method?: HTTPMethod
  data?: T
  headers?: any
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

export const fetcher = async <R, T>(url?: string, options?: Options<T>): Promise<Response<R>> => {
  return await axios
    .request({ url, ...options })
    .then(handleResponse)
    .catch((error) => handleError<R>(error))
}

// Use this when possible in the codebase
export const fetcherTE = <A, T>(url: string, options: Options<T>): TE.TaskEither<string, Response<A>> =>
  pipe(
    TE.tryCatch(
      async () => await fetcher<A, T>(url, options),
      (reason) => `Error fetching from ${url}: ${reason}`
    ),
    TE.chain((response: Response<A>) => (response.error ? TE.left(response.error) : TE.right(response)))
  )
