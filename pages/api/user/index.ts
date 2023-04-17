import nextConnect from "next-connect"
import auths from "../../../lib/middlewares/auth"
import { getMongoDb } from "../../../lib/mongodb"
import { deleteUser, updateUserById } from "../../../lib/queries/user"
import { NextApiRequest, NextApiResponse } from "next"

import { Response } from "../../../types/response"
import { handleAPIError, handleAPIResponse } from "../../../lib/utils"

import { UserModelSchema, UserModelSchemaType } from "../../../schema/UserSchema"

const handler = nextConnect<NextApiRequest, NextApiResponse<Response<Omit<UserModelSchemaType, "password"> | null>>>()

handler.use(...auths)

handler.get(async (req, res) =>
  !req.user ? handleAPIResponse(res, null, "No user found") : handleAPIResponse(res, req.user, "User found")
)

handler.delete(async (req, res) => {
  if (!req.user) {
    return handleAPIResponse(res, null, "No user found")
  }

  try {
    const db = await getMongoDb()
    await deleteUser(db, req.user?._id)
    await req.session.destroy()
    handleAPIResponse(res, null, "User deleted")
  } catch (error) {
    console.log("Error when deleting user")
    handleAPIError(res, error)
  }
})

handler.patch(async (req, res) => {
  if (!req.user) {
    return handleAPIResponse(res, null, "No user found")
  }

  try {
    const db = await getMongoDb()

    const parsedBody = UserModelSchema.partial().safeParse(req.body)


    if (!parsedBody.success) {
      return handleAPIError(res, { message: "Validation error. User input" })
    }

    const user = await updateUserById(db, req.user?._id, parsedBody.data)

    const parsedUser = UserModelSchema.omit({ password: true }).safeParse(user)

    if (!parsedUser.success) {
      return handleAPIError(res, { message: "Validation error when updating user" })
    }

    handleAPIResponse(res, parsedUser.data, "User updated successfully")
  } catch (error) {
    console.log("Error when updating user")
    handleAPIError(res, error)
  }
})

export default handler
