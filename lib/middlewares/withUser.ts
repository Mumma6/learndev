import { NextApiRequest, NextApiResponse } from "next"
import { IUser } from "../../types/user"

interface Request extends NextApiRequest {
  user: IUser
}

export default async function withUser(req: Request, res: NextApiResponse, next: () => void) {
  next()
}
