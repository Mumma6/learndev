export type Response<R> = {
  payload?: R | null
  error?: string | null
  message?: string
}
