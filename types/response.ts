/*
TODO

Payload and error should not be optional. Remove the "?"

This fix will cause the need for a lot of changes in the code

*/

export interface Response<R> {
  payload?: R | null
  error?: string | null
  message?: string
}
