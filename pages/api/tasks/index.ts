import { NextApiRequest, NextApiResponse } from "next"
import nextConnect from "next-connect"
import { z } from "zod"
import auths from "../../../lib/middlewares/auth"
import { addTaskToDb, deleteTaskById, getTasksForUser, updateTaskById } from "../../../lib/queries/tasks"
import {
  addUserId,
  checkUser,
  createDeleteHandler,
  getUserId,
  handleAPIError,
  handleAPIResponse,
  validateArrayData,
  validateArrayData2,
  validateData,
  validateData2,
  validateReqBody,
  validateReqBody2,
} from "../../../lib/utils"
import { TaskFormInputSchema, TaskFormInputType, TaskModelSchema, TaskModelType } from "../../../schema/TaskSchema"
import * as E from "fp-ts/Either"
import { pipe } from "fp-ts/function"
import * as TE from "fp-ts/TaskEither"

import { Response } from "../../../types/response"

const handler = nextConnect<NextApiRequest, NextApiResponse<Response<TaskModelType[] | null>>>()

handler.get(...auths, async (req, res) => {
  const task = pipe(
    req,
    checkUser,
    E.chain(getUserId),
    TE.fromEither,
    TE.chain(getTasksForUser),
    TE.chain(validateArrayData2<TaskModelType>(TaskModelSchema))
  )

  const either = await task()

  pipe(
    either,
    E.fold(
      (error) => handleAPIError(res, { message: error }),
      (data) => handleAPIResponse(res, data, `tasks for user: ${req.user?.name}`)
    )
  )
})

handler.patch(...auths, async (req, res) => {
  const task = pipe(
    req,
    checkUser,
    E.chain(validateReqBody2<Partial<TaskFormInputType>>(TaskModelSchema.partial())),
    TE.fromEither,
    TE.chain(updateTaskById)
  )

  const either = await task()

  pipe(
    either,
    E.chain(validateData2<TaskModelType>(TaskModelSchema)),
    E.fold(
      (error) => handleAPIError(res, error),
      (data) => handleAPIResponse(res, data, "Task updated successfully")
    )
  )
})

handler.post(...auths, async (req, res) => {
  const addNonInputData =
    (userId: string) =>
    (data: TaskFormInputType): Omit<TaskModelType, "_id"> => ({
      ...data,
      createdAt: new Date(),
      userId,
    })

  const task = pipe(
    req,
    checkUser,
    E.chain(validateReqBody2<TaskFormInputType>(TaskFormInputSchema)),
    E.map(addNonInputData(addUserId(req))),
    TE.fromEither,
    TE.chain(addTaskToDb)
  )

  const either = await task()

  pipe(
    either,
    E.fold(
      (error) => handleAPIError(res, error),
      () => handleAPIResponse(res, null, "Task added")
    )
  )
})

handler.delete(...auths, createDeleteHandler(deleteTaskById))

export default handler
