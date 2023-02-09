import { v2 as cloudinary } from "cloudinary"
import slug from "slug"
import multer from "multer"
import nextConnect from "next-connect"
import auths from "../../../lib/middlewares/auth"
import { getMongoDb } from "../../../lib/mongodb"
import { deleteUser, findUserByEmail, updateUserById } from "../../../lib/queries/user"
import { NextApiRequest, NextApiResponse } from "next"
import { IUser } from "../../../types/user"
import { Response } from "../../../types/response"
import { handleAPIError, handleAPIResponse } from "../../../lib/utils"
import { ObjectId } from "mongodb"
import { UserModelSchema, UserModelSchemaType } from "../../../schema/UserSchema"

const handler = nextConnect<NextApiRequest, NextApiResponse<Response<UserModelSchemaType | null>>>()

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

    const parsedBody = UserModelSchema.safeParse(req.body)

    if (!parsedBody.success) {
      return handleAPIError(res, { message: "Validation error when trying to update user" })
    }

    if (parsedBody.data.email !== req.user?.email && (await findUserByEmail(db, parsedBody.data.email))) {
      handleAPIResponse(res, null, "The email has already been taken.")
    }

    // Make sure that all the old propertes are also sent from the frontend because we overwrite it and dont want to lose the old data, ex completedQuizzes

    // Should be partial? Just send the parsedData which can be any of these.
    const user = await updateUserById(db, req.user?._id, parsedBody.data)

    const parsedUser = UserModelSchema.safeParse(user)

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

/*
// Need to register on cloudinary.com
/*

//upload.single("profilePicture"),
if (process.env.CLOUDINARY_URL) {
  const { hostname: cloud_name, username: api_key, password: api_secret } = new URL(process.env.CLOUDINARY_URL)

  cloudinary.config({
    cloud_name,
    api_key,
    api_secret,
  })
}

 let profilePicture
      if (req.file) {
        const image = await cloudinary.uploader.upload(req.file.path, {
          width: 512,
          height: 512,
          crop: "fill",
        })
        profilePicture = image.secure_url
      }

const upload = multer({ dest: "/tmp" })

*/
