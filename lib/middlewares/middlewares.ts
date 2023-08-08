import { type NextConnect } from "next-connect"
import mongoSanitize from "express-mongo-sanitize"
import rateLimit from "express-rate-limit"

import { type NextApiRequest, type NextApiResponse } from "next"
import auths from "./auth"

interface IMiddleware extends NextConnect<NextApiRequest, NextApiResponse> {}

// TODO: Add these to all routes. Only "courses" have been converted

const middlewares = [
  ...auths,
  mongoSanitize(),
  /*
  ValidationError: An undefined 'request.ip' was detected. This might indicate a misconfiguration or the connection being destroyed prematurely. See https://express-rate-limit.github.io/ERR_ERL_UNDEFINED_IP_ADDRESS/ for more information on this error.
  rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
  }),
  */
] as IMiddleware[]

export default middlewares
