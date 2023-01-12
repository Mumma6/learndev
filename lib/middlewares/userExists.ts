import { NextApiRequest, NextApiResponse } from "next"
import { handleAPIResponse } from "../utils"

// seems like this is not working. Explore why
export default async function userExists(
  req: NextApiRequest,
  res: NextApiResponse,
  next: () => void
) {
  if (!req.user) {
    handleAPIResponse(res, [], "User auth")
    console.log("No user found in middleware.")
    return
  }
  next()
}
