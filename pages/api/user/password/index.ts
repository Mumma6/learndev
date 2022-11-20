import nextConnect from "next-connect"
import auths from "../../../../lib/middlewares/auth"
import { getMongoDb } from "../../../../lib/mongodb"
import { updateUserPasswordByOldPassword } from "../../../../lib/queries/user"

const ncOpts = {
  onError(err: any, req: any, res: any) {
    console.error(err)
    res.statusCode = err.status && err.status >= 100 && err.status < 600 ? err.status : 500
    res.json({ message: err.message })
  },
}

const handler = nextConnect(ncOpts)
handler.use(...auths)

handler.put(
  /*
  validateBody({
    type: "object",
    properties: {
      oldPassword: ValidateProps.user.password,
      newPassword: ValidateProps.user.password,
    },
    required: ["oldPassword", "newPassword"],
    additionalProperties: false,
  }),
  */
  async (req: any, res: any) => {
    if (!req.user) {
      res.json(401).end()
      return
    }

    const db = await getMongoDb()

    const { oldPassword, newPassword } = req.body

    console.log(req.body)

    const success = await updateUserPasswordByOldPassword(db, req.user._id, oldPassword, newPassword)

    console.log(success)

    if (!success) {
      res.status(401).json({
        error: { message: "The old password you entered is incorrect." },
      })
      return
    }

    res.status(200).json({ message: "Password updated" })
  }
)

export default handler
