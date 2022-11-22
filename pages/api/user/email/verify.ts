import nextConnect from "next-connect"
import normalizeEmail from "validator/lib/normalizeEmail"
import { CONFIG as MAIL_CONFIG, sendMail } from "../../../../lib/mail"
import { getMongoDb } from "../../../../lib/mongodb"
import { createToken, findAndDeleteTokenByIdAndType } from "../../../../lib/queries/token"
import { findUserByEmail, findUserById, UNSAFE_updateUserPassword } from "../../../../lib/queries/user"
import { IUser } from "../../../../types/user"

const ncOpts = {
  onError(err: any, req: any, res: any) {
    console.error(err)
    res.statusCode = err.status && err.status >= 100 && err.status < 600 ? err.status : 500
    res.json({ message: err.message })
  },
}

const handler = nextConnect(ncOpts)

handler.post(async (req, res) => {
  const db = await getMongoDb()

  //const email = normalizeEmail(req.body.email)
  const user = await findUserById(db, req.body.userId)
  if (!user) {
    console.log("no user")
    res.status(404).json({
      error: { message: "No user found. Please try again." },
    })
    return
  }

  console.log("creating token")
  const token = await createToken(db, {
    creatorId: user._id,
    type: "emailVerify",
    expireAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
  })

  console.log("Sending email")

  await sendMail({
    to: user.email,
    from: MAIL_CONFIG.from,
    subject: `Verification Email for ${process.env.WEB_URI}`,
    html: `
      <div>
        <p>Hello, ${user.name}</p>
        <p>Please follow <a href="${process.env.WEB_URI}/verify-email/${token.securedTokenId}">this link</a> to confirm your email.</p>
      </div>
      `,
  })

  res.status(200).json({ message: "email sent" })
})

export default handler
