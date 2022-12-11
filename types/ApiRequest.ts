import { NextApiRequest, NextApiResponse } from "next"
import { IUser } from "./user"

export default interface ApiRequest extends NextApiRequest {
  user: IUser
}
