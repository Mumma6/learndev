import nextConnect from "next-connect"
import auths from "../../../lib/middlewares/auth"
import passport from "../../../lib/passport"
import { type NextApiRequest, type NextApiResponse } from "next"
import { handleAPIResponse } from "../../../lib/utils"
import { type Response } from "../../../types/response"
import { type UserModelSchemaType } from "../../../schema/UserSchema"

const handler = nextConnect<NextApiRequest, NextApiResponse<Response<UserModelSchemaType | null>>>()

handler.use(...auths)

// This will trowh an error in axiosfetcher when getting a 401
// For some reason the handleResponse function wont call.
// The "else" part in passport.js wont run.
handler.post(passport.authenticate("local"), (req, res) => { handleAPIResponse(res, req.user || null, "User auth") })

handler.delete(async (req, res) => {
  await req.session.destroy()
  handleAPIResponse(res, null, "User logged out")
})

export default handler
