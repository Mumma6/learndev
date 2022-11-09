import nc from "next-connect"
import { validateBody } from "../../../lib/middlewares/ajv"
import auths from "../../../lib/middlewares/auth"
import { getMongoDb } from "../../../lib/mongodb"
import { ValidateProps } from "../../../lib/schema"
import slug from "slug"
import normalizeEmail from "validator/lib/normalizeEmail"
import isEmail from "validator/lib/isEmail"
import { findUserByEmail, insertUser } from "../../../lib/queries/user"

const ncOpts = {
  onError(err: any, req: any, res: any) {
    console.error(err)
    res.statusCode = err.status && err.status >= 100 && err.status < 600 ? err.status : 500
    res.json({ message: err.message })
  },
}

const handler = nc(ncOpts)

handler.post(
  validateBody({
    type: "object",
    properties: {
      name: ValidateProps.user.name,
      password: ValidateProps.user.password,
      email: ValidateProps.user.email,
    },
    required: ["name", "password", "email"],
    additionalProperties: false,
  }),

  ...auths,
  async (req, res) => {
    const db = await getMongoDb()

    let { name, email, password } = req.body
    const normalizedEmail = normalizeEmail(req.body.email) as string
    if (!isEmail(normalizedEmail)) {
      res.status(400).json({ error: { message: "The email you entered is invalid." } })
      return
    }
    if (await findUserByEmail(db, email)) {
      console.log("email found")
      res.status(403).json({ error: { message: "The email has already been used." } })
      return
    }
    const user = await insertUser(db, {
      email,
      originalPassword: password,
      bio: "",
      name,
    })
    req.logIn(user, (err: any) => {
      if (err) throw err
      res.status(201).json({
        user,
      })
    })
  }
)

export default handler
