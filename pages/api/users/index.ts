import nextConnect from "next-connect"
import auths from "../../../lib/middlewares/auth"
import { getMongoDb } from "../../../lib/mongodb"
import { ValidateProps } from "../../../lib/schema"
import slug from "slug"
import normalizeEmail from "validator/lib/normalizeEmail"
import isEmail from "validator/lib/isEmail"
import { findUserByEmail, insertUser } from "../../../lib/queries/user"
import { Response } from "../../../types/response"
import { IUser } from "../../../types/user"
import { NextApiRequest, NextApiResponse } from "next"
import { handleAPIError, handleAPIResponse } from "../../../lib/utils"

// its better to use the validatebody function?
interface RequestBody {
  body: {
    name: string
    email: string
    password: string
  }
}

const handler = nextConnect<NextApiRequest, NextApiResponse<Response<IUser | null>>>()

handler.post<RequestBody>(...auths, async (req, res) => {
  const db = await getMongoDb()

  const { name, email, password } = req.body
  const normalizedEmail = normalizeEmail(req.body.email) as string
  if (!isEmail(normalizedEmail)) {
    handleAPIResponse(res, null, "The email you entered is invalid.")
  }
  if (await findUserByEmail(db, email)) {
    handleAPIResponse(res, null, "The email you entered is already in use.")
  }

  try {
    // All other props will get a default value in the function
    const user = await insertUser(db, {
      email,
      password,
      name,
    })
    req.logIn(user, (err: any) => {
      if (err) {
        console.log("error with passport logIn fn")
        handleAPIError(res, err)
      }
      handleAPIResponse(res, user, "No user found")
    })
  } catch (error) {
    console.log("Error when creating user")
    handleAPIError(res, error)
  }
})

export default handler
