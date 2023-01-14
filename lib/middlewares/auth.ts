import passport from "../passport"
import session from "./sessions"
import { NextConnect } from "next-connect"

import { NextApiRequest, NextApiResponse } from "next"
import userExists from "./userExists"

interface IMiddleware extends NextConnect<NextApiRequest, NextApiResponse> {}

const auths: IMiddleware[] = [session, passport.initialize(), passport.session()]

export default auths
