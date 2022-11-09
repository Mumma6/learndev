import nc from "next-connect"
import auths from "../../../lib/middlewares/auth"
import passport from "../../../lib/passport"

const ncOpts = {
  onError(err: any, req: any, res: any) {
    console.error(err)
    res.statusCode = err.status && err.status >= 100 && err.status < 600 ? err.status : 500
    res.json({ message: err.message })
  },
}

const handler = nc(ncOpts)

handler.use(...auths)

console.log(1)

// This wont return anything if password or email is incorrect.
// The error is handeld in fetcher instead.
// passport.authenticate("local")
handler.post(passport.authenticate("local"))

/*

// this works when using the wrong credentials but not when using the right.
handler.post(
  function (req, res, next) {
    // call passport authentication passing the "local" strategy name and a callback function
    passport.authenticate("local", function (error, user, info) {
      // this will execute in any case, even if a passport strategy will find an error
      // log everything to console
      console.log(error)
      console.log(user)
      console.log(info)

      if (error) {
        res.status(401).send(error)
      } else if (!user) {
        res.status(401).send(info)
      } else {
        console.log("next")
        next()
      }
    })(req, res)
  },

  (req, res) => {
    res.json({ user: req.body })
  }
)
*/

handler.delete(async (req, res) => {
  await req.session.destroy()
  res.status(204).end()
})

export default handler
