import { NextApiRequest, NextApiResponse } from "next"
import ApiRequest from "../types/ApiRequest"

export const nextConnectOptions = {
  onError(err: any, req: ApiRequest, res: NextApiResponse) {
    res.statusCode = err.status && err.status >= 100 && err.status < 600 ? err.status : 500
    res.json({ message: err.message })
  },
}
