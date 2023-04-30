import { NextApiRequest, NextApiResponse } from "next"
import nextConnect from "next-connect"
import auths from "../../../lib/middlewares/auth"

import {
  addUserId,
  checkUser,
  createDeleteHandler,
  getUserId,
  handleAPIError,
  handleAPIResponse,
  validateAndGetUserId,
  validateArrayData2,
  validateData2,
} from "../../../lib/utils"
import {
  ProjectModelFormInputSchema,
  ProjectModelFromInputType,
  ProjectModelSchema,
  ProjectModelType,
} from "../../../schema/ProjectSchema"
import * as E from "fp-ts/Either"
import { pipe } from "fp-ts/function"
import * as TE from "fp-ts/TaskEither"
import { Response } from "../../../types/response"
import {
  addToDbCollection,
  deleteFromCollectionById,
  getFromCollectionForUser,
  updateFromCollectionById,
} from "../../../lib/queries"
import { validateReqBody2 } from "../../../lib/utils"

const handler = nextConnect<NextApiRequest, NextApiResponse<Response<ProjectModelType[] | null>>>()

handler.get(...auths, async (req, res) => {
  const task = pipe(
    req,
    validateAndGetUserId,
    TE.chain(getFromCollectionForUser("projects")),
    TE.chain(validateArrayData2<ProjectModelType>(ProjectModelSchema))
  )

  const either = await task()

  pipe(
    either,
    E.fold(
      (error) => handleAPIError(res, { message: error }),
      (data) => handleAPIResponse(res, data, `Projects for user: ${req.user?.name}`)
    )
  )
})

const createTags = (data: Pick<ProjectModelType, "techStack" | "title">) =>
  [data.title, ...data.techStack.map((t) => t.label)].map((tag) => tag.toLowerCase()).join(", ")

handler.post(...auths, async (req, res) => {
  const addNonInputData =
    (userId: string) =>
    (data: ProjectModelFromInputType): Omit<ProjectModelType, "_id"> => ({
      ...data,
      tags: createTags(data),
      userId,
      createdAt: new Date(),
    })

  const task = pipe(
    req,
    checkUser,
    E.chain(validateReqBody2<ProjectModelFromInputType>(ProjectModelFormInputSchema)),
    E.map(addNonInputData(addUserId(req))),
    TE.fromEither,
    TE.chain(addToDbCollection("projects"))
  )

  const either = await task()

  pipe(
    either,
    E.fold(
      (error) => handleAPIError(res, { message: error }),
      () => handleAPIResponse(res, null, "Project added")
    )
  )
})

handler.delete(...auths, createDeleteHandler(deleteFromCollectionById("projects")))

handler.patch(...auths, async (req, res) => {
  const task = pipe(
    req,
    checkUser,
    E.chain(validateReqBody2<Partial<ProjectModelFromInputType>>(ProjectModelSchema.partial())),
    TE.fromEither,
    TE.chain(updateFromCollectionById("projects"))
  )

  const either = await task()

  pipe(
    either,
    E.chain(validateData2<ProjectModelFromInputType>(ProjectModelSchema)),
    E.fold(
      (error) => handleAPIError(res, { message: error }),
      (data) => handleAPIResponse(res, data, "Project updated successfully")
    )
  )
})

export default handler
