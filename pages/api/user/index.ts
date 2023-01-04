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

const upload = multer({ dest: "/tmp" })

const handler = nextConnect<NextApiRequest, NextApiResponse<Response<IUser | null>>>()

// Need to register on cloudinary.com
if (process.env.CLOUDINARY_URL) {
  const { hostname: cloud_name, username: api_key, password: api_secret } = new URL(process.env.CLOUDINARY_URL)

  cloudinary.config({
    cloud_name,
    api_key,
    api_secret,
  })
}

handler.use(...auths)

handler.get(async (req, res) =>
  !req.user ? handleAPIResponse(res, null, "No user found") : handleAPIResponse(res, req.user, "User found")
)

handler.delete(async (req, res) => {
  if (!req.user) {
    handleAPIResponse(res, null, "No user found")
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

handler.patch(
  //upload.single("profilePicture"),

  async (req, res) => {
    if (!req.user) {
      handleAPIResponse(res, null, "No user found")
    }

    try {
      const db = await getMongoDb()

      let profilePicture
      if (req.file) {
        const image = await cloudinary.uploader.upload(req.file.path, {
          width: 512,
          height: 512,
          crop: "fill",
        })
        profilePicture = image.secure_url
      }

      const { bio, skills, workexperience }: Partial<IUser> = req.body

      workexperience?.forEach((w) => {
        w._id = new ObjectId()
      })

      let email

      if (req.body.email) {
        email = slug(req.body.email, "_")
        if (email !== req.user?.email && (await findUserByEmail(db, email))) {
          handleAPIResponse(res, null, "The email has already been taken.")
        }
      }

      const user = (await updateUserById(db, req.user?._id, {
        ...(typeof bio === "string" && { bio }),
        ...(profilePicture && { profilePicture }),
        ...(skills && { skills }),
        ...(workexperience && { workexperience }),
      })) as IUser | null

      handleAPIResponse(res, user, "User updated successfully")
    } catch (error) {
      console.log("Error when updating user")
      handleAPIError(res, error)
    }
  }
)

export default handler
