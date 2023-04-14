import { NextApiRequest, NextApiResponse } from "next"
import nextConnect from "next-connect"
import auths from "../../../lib/middlewares/auth"

import { addEventForUser, deleteEventById, getEventsForUser } from "../../../lib/queries/events"
import { checkUser, createDeleteHandler, getUserId, handleAPIError, handleAPIResponse } from "../../../lib/utils"
import { IEventInfo } from "../../../models/EventInfo"
import { Response } from "../../../types/response"
import * as E from "fp-ts/Either"
import { pipe } from "fp-ts/function"
import * as TE from "fp-ts/TaskEither"

const handler = nextConnect<NextApiRequest, NextApiResponse<Response<IEventInfo[] | null>>>()

handler.get(...auths, async (req, res) => {
  const task = pipe(req, checkUser, E.chain(getUserId), TE.fromEither, TE.chain(getEventsForUser))

  const either = await task()

  pipe(
    either,
    E.fold(
      (error) => handleAPIError(res, { message: error }),
      (events) => handleAPIResponse(res, events, `events for user: ${req.user?.name}`)
    )
  )
})

handler.post(...auths, async (req, res) => {
  // Needs validation on req body here. First add Event zod schema

  const addUserId = () =>
    pipe(
      req,
      getUserId,
      E.getOrElse(() => "")
    )

  const task = pipe(
    req,
    checkUser,
    E.map((req) => ({
      userId: addUserId(),
      ...req.body,
    })),
    TE.fromEither,
    TE.chain(addEventForUser)
  )

  const either = await task()

  pipe(
    either,
    E.fold(
      (error) => handleAPIError(res, error),
      () => handleAPIResponse(res, null, "Event added")
    )
  )
})

handler.delete(...auths, createDeleteHandler(deleteEventById))

export default handler
