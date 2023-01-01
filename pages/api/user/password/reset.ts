import nextConnect from "next-connect"
import normalizeEmail from "validator/lib/normalizeEmail"
import { CONFIG as MAIL_CONFIG, sendMail } from "../../../../lib/mail"
import { getMongoDb } from "../../../../lib/mongodb"
import { createToken, findAndDeleteTokenByIdAndType } from "../../../../lib/queries/token"
import { findUserByEmail, UNSAFE_updateUserPassword } from "../../../../lib/queries/user"

const ncOpts = {
  onError(err: any, req: any, res: any) {
    console.error(err)
    res.statusCode = err.status && err.status >= 100 && err.status < 600 ? err.status : 500
    res.json({ message: err.message })
  },
}

const handler = nextConnect(ncOpts)

handler.post(
  /*
  validateBody({
    type: "object",
    properties: {
      email: ValidateProps.user.email,
    },
    required: ["email"],
    additionalProperties: false,
  }),
  */
  async (req, res) => {
    const db = await getMongoDb()

    //const email = normalizeEmail(req.body.email)
    const user = await findUserByEmail(db, req.body.email)
    if (!user) {
      console.log("no user")
      res.status(404).json({
        error: { message: "We couldnt find that email. Please try again." },
      })
      return
    }

    const token = await createToken(db, {
      creatorId: user._id,
      type: "passwordReset",
      expireAt: new Date(Date.now() + 1000 * 60 * 20),
    })

    await sendMail({
      to: req.body.email,
      from: MAIL_CONFIG.from,
      subject: "DevLearner: Reset your password.",
      html: `
      <div>
        <p>Hello, ${user.name}</p>
        <p>Please follow <a href="${process.env.WEB_URI}/forgot-password/${token.securedTokenId}">this link</a> to reset your password.</p>
      </div>
      `,
    })

    res.status(200).json({ message: "email sent" })
  }
)

handler.put(
  /*
  validateBody({
    type: 'object',
    properties: {
      password: ValidateProps.user.password,
      token: { type: 'string', minLength: 0 },
    },
    required: ['password', 'token'],
    additionalProperties: false,
  }),
  */
  async (req, res) => {
    const db = await getMongoDb()

    console.log("delating token...")
    const deletedToken = await findAndDeleteTokenByIdAndType(db, req.body.token, "passwordReset")
    if (!deletedToken) {
      res.status(403).end()
      return
    }
    console.log("updating pw...")
    await UNSAFE_updateUserPassword(db, deletedToken.creatorId, req.body.password)

    console.log("password updated felfrit...")
    res.status(200).json({ message: "Password has been updated" })
  }
)

export default handler
