import { v2 as cloudinary } from "cloudinary"
import slug from "slug"
import multer from "multer"
import nc from "next-connect"
import { validateBody } from "../../../lib/middlewares/ajv"
import auths from "../../../lib/middlewares/auth"
import { getMongoDb } from "../../../lib/mongodb"
import { ValidateProps } from "../../../lib/schema"
import { findUserByEmail, updateUserById } from "../../../lib/queries/user"

const ncOpts = {
  onError(err: any, req: any, res: any) {
    console.error(err)
    res.statusCode = err.status && err.status >= 100 && err.status < 600 ? err.status : 500
    res.json({ message: err.message })
  },
}

const upload = multer({ dest: "/tmp" })
const handler = nc(ncOpts)

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

handler.get(async (req: any, res: any) => {
  if (!req.user) return res.json({ user: null })
  return res.json({ user: req.user })
})

handler.patch(
  /*
  upload.single("profilePicture"),
  validateBody({
    type: "object",
    properties: {
      name: ValidateProps.user.name,
      bio: ValidateProps.user.bio,
    },
    additionalProperties: true,
  }),
  */

  async (req, res) => {
    if (!req.user) {
      req.status(401).end()
      return
    }

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
    const { name, bio } = req.body

    let email

    if (req.body.email) {
      email = slug(req.body.email, "_")
      if (email !== req.user.email && (await findUserByEmail(db, email))) {
        res.status(403).json({ error: { message: "The email has already been taken." } })
        return
      }
    }

    const user = await updateUserById(db, req.user._id, {
      ...(typeof bio === "string" && { bio }),
      ...(profilePicture && { profilePicture }),
    })

    res.json({ user })
  }
)

export const config = {
  api: {
    bodyParser: false,
  },
}

export default handler
