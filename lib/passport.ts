import passport from "passport"
import { Strategy as LocalStrategy } from "passport-local"
import { getMongoDb } from "./mongodb"
import { findUserForAuth, findUserWithEmailAndPassword } from "./utils/user"

// TODO
/*

Fix types for passport.

Our passport.serializeUser function will serialize the user id into our session. Later we will use that same id to get our user object in passport.deserializeUser. The reason we have to pass it into ObjectId is because our _id in MongoDB collection is of such type, while the serialized _id is of type string.
*/

passport.serializeUser((user: any, done) => {
  done(null, user._id)
})

passport.deserializeUser((req: any, id: any, done: any) => {
  getMongoDb().then((db) => {
    findUserForAuth(db, id).then(
      (user) => done(null, user),
      (err) => done(err)
    )
  })
})

passport.use(
  new LocalStrategy({ usernameField: "email", passReqToCallback: true }, async (req, email, password, done) => {
    const db = await getMongoDb()
    const user = await findUserWithEmailAndPassword(db, email, password)
    if (user) done(null, user)
    else done(null, false, { message: "Email or password is incorrect" })
  })
)

export default passport
