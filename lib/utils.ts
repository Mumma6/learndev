import { NextApiResponse } from "next"
import { Response } from "../types/response"

/*
Update to function to include a status code aswell

*/

export const handleAPIResponse = <T>(res: NextApiResponse<Response<T>>, payload: T, message: string): void => {
  res.statusCode = 200
  res.json({ payload, error: null, message })
}

export const handleAPIError = (res: NextApiResponse, error: any): void => {
  res.statusCode = 200
  res.json({ payload: null, error: error.message, message: "An error occurred" })
}
