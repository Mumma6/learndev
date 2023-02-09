import passport from "passport"
import { Strategy as LocalStrategy, Strategy } from "passport-local"
import { NextApiRequest } from "next"
import { Request } from "express"
import { getMongoDb } from "./mongodb"
import { findUserForAuth, findUserWithEmailAndPassword } from "./queries/user"

/*
The passport field in the session collection is added by Passport.js, specifically by the passport.serializeUser() function.

*/
passport.serializeUser((user, done) => {
  done(null, user._id)
})

passport.deserializeUser(async (req: NextApiRequest, id: string, done: (error: any, user?: any) => void) => {
  try {
    const db = await getMongoDb()
    const user = await findUserForAuth(db, id)
    done(null, user)
  } catch (err) {
    done(err)
  }
})

passport.use(
  new LocalStrategy({ usernameField: "email", passReqToCallback: true }, async (_, email, password, done) => {
    const db = await getMongoDb()
    const user = await findUserWithEmailAndPassword(db, email, password)
    if (user) {
      done(null, user)
    } else {
      done(null, false, { message: "Else from passport.use" })
    }
  })
)

export default passport

/*
passport.deserializeUser((req: any, id: string, done: any) => {
  getMongoDb().then((db) => {
    findUserForAuth(db, id).then(
      (user) => done(null, user),
      (err) => done(err)
    )
  })
})


The code you provided appears to be setting up Passport.js, a popular authentication middleware for Node.js, to be used with Next.js, a framework for building server-rendered or statically-exported React apps. It also appears to be using MongoDB, a NoSQL database, to store user data.

Here's a brief overview of how the code works:

The serializeUser and deserializeUser functions are used to store and retrieve user data from the session. The serializeUser function is called when a user logs in, and it saves the user's unique identifier (in this case, their _id field from the MongoDB database) to the session. The deserializeUser function is called on every subsequent request, and it retrieves the user's data from the database using the unique identifier saved in the session.

The LocalStrategy is a Passport.js strategy that allows users to log in with a username and password. It uses the findUserWithEmailAndPassword function to search the MongoDB database for a user with the provided email and password. If a user is found, it calls the done callback with the user object, which tells Passport.js that the authentication was successful. If no user is found, it calls the done callback with false and an error message, which tells Passport.js that the authentication failed.

The handler object is a Next.js Connect middleware that handles HTTP requests. It uses the auths middleware array, which includes the session, passport.initialize(), and passport.session() middleware, to handle user sessions and Passport.js authentication. The handler.post route authenticates a user with the passport.authenticate("local") middleware and, if the authentication is successful, sends the user object as a JSON response. The handler.delete route destroys the user's session.

The getSession function is a Next.js session middleware that uses the mongoStore object to store session data in a MongoDB database. The session function is a wrapper around the getSession function that provides a consistent API for use with Next.js.
*/
