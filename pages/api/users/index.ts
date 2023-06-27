import nextConnect from "next-connect"
import auths from "../../../lib/middlewares/auth"
import { getMongoDb } from "../../../lib/mongodb"

import { findUserByEmail, insertUser } from "../../../lib/queries/user"
import { type Response } from "../../../types/response"
import { type NextApiRequest, type NextApiResponse } from "next"
import { handleAPIError, handleAPIResponse } from "../../../lib/utils"
import { type UserModelSchemaType, UserRegistrationSchema } from "../../../schema/UserSchema"

const handler = nextConnect<NextApiRequest, NextApiResponse<Response<UserModelSchemaType | null>>>()

handler.post(...auths, async (req, res) => {
  const db = await getMongoDb()

  try {
    const parsedFormInput = UserRegistrationSchema.safeParse(req.body)

    if (!parsedFormInput.success) {
      console.log(parsedFormInput.error)

      handleAPIError(res, { message: "Validation error" }); return
    }

    const { data } = parsedFormInput
    const { email, password, name } = data

    if (await findUserByEmail(db, email)) {
      handleAPIError(res, { message: "The email you entered is already in use." }); return
    }

    // All other props will get a default value in the function
    const user = await insertUser(db, {
      email,
      password,
      name
    })

    req.logIn(user, (err: any) => {
      if (err) {
        console.log("error with passport logIn fn")
        console.log(err)
        handleAPIError(res, err); return
      }

      if (!user) {
        handleAPIError(res, { message: "No user found" }); return
      }

      handleAPIResponse(res, user, "User found")
    })
  } catch (error) {
    console.log("Error when creating user")
    handleAPIError(res, error)
  }
})

export default handler
