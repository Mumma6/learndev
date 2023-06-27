import { type NextApiRequest, type NextApiResponse } from "next"
import nextConnect from "next-connect"

import auths from "../../../lib/middlewares/auth"

import {
  addUserId,
  checkUser,
  createDeleteHandler,
  handleAPIError,
  handleAPIResponse,
  validateAndGetUserId,
  validateArrayData2,
  validateData2,
  validateReqBody2
} from "../../../lib/utils"
import { TaskFormInputSchema, type TaskFormInputType, TaskModelSchema, type TaskModelType } from "../../../schema/TaskSchema"
import * as E from "fp-ts/Either"
import { pipe } from "fp-ts/function"
import * as TE from "fp-ts/TaskEither"

import { type Response } from "../../../types/response"
import {
  addToDbCollection,
  deleteFromCollectionById,
  getFromCollectionForUser,
  updateFromCollectionById
} from "../../../lib/queries"

const handler = nextConnect<NextApiRequest, NextApiResponse<Response<TaskModelType[] | null>>>()

handler.get(...auths, async (req, res) => {
  const task = pipe(
    req,
    validateAndGetUserId,
    TE.chain(getFromCollectionForUser("tasks")),
    TE.chain(validateArrayData2<TaskModelType>(TaskModelSchema))
  )

  const either = await task()

  pipe(
    either,
    E.fold(
      (error) => { handleAPIError(res, { message: error }) },
      (data) => { handleAPIResponse(res, data, `tasks for user: ${req.user?.name}`) }
    )
  )
})

handler.patch(...auths, async (req, res) => {
  const task = pipe(
    req,
    checkUser,
    E.chain(validateReqBody2<Partial<TaskFormInputType>>(TaskModelSchema.partial())),
    TE.fromEither,
    TE.chain(updateFromCollectionById("tasks"))
  )

  const either = await task()

  pipe(
    either,
    E.chain(validateData2<TaskModelType>(TaskModelSchema)),
    E.fold(
      (error) => { handleAPIError(res, error) },
      (data) => { handleAPIResponse(res, data, "Task updated successfully") }
    )
  )
})

handler.post(...auths, async (req, res) => {
  const addNonInputData =
    (userId: string) =>
      (data: TaskFormInputType): Omit<TaskModelType, "_id"> => ({
        ...data,
        createdAt: new Date(),
        userId
      })

  const task = pipe(
    req,
    checkUser,
    E.chain(validateReqBody2<TaskFormInputType>(TaskFormInputSchema)),
    E.map(addNonInputData(addUserId(req))),
    TE.fromEither,
    TE.chain(addToDbCollection("tasks"))
  )

  const either = await task()

  pipe(
    either,
    E.fold(
      (error) => { handleAPIError(res, { message: error }) },
      () => { handleAPIResponse(res, null, "Task added") }
    )
  )
})

handler.delete(...auths, createDeleteHandler(deleteFromCollectionById("tasks")))

export default handler
