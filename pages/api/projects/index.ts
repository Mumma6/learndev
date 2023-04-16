import { NextApiRequest, NextApiResponse } from "next"
import nextConnect from "next-connect"
import auths from "../../../lib/middlewares/auth"
import { deleteProjectById, getProjectsForUser, insertProject, updateProjectById } from "../../../lib/queries/projects"

import {
  addUserId,
  checkUser,
  createDeleteHandler,
  getUserId,
  handleAPIError,
  handleAPIResponse,
  validateArrayData,
  validateData,
  validateReqBody,
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

const handler = nextConnect<NextApiRequest, NextApiResponse<Response<ProjectModelType[] | null>>>()

handler.get(...auths, async (req, res) => {
  const task = pipe(
    req,
    checkUser,
    E.chain(getUserId),
    TE.fromEither,
    TE.chain(getProjectsForUser),
    TE.chain((projects) => TE.fromEither(validateArrayData<ProjectModelType>(projects, ProjectModelSchema)))
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
    (data: ProjectModelFromInputType) =>
    (userId: string): Omit<ProjectModelType, "_id"> => ({
      ...data,
      tags: createTags(data),
      userId,
      createdAt: new Date(),
      tasks: [], // får komma in som data
      resources: [], // får komma in som data
    })

  const task = pipe(
    req,
    checkUser,
    E.chain((req) => validateReqBody<ProjectModelFromInputType>(req, ProjectModelFormInputSchema)),
    E.map((project) => addNonInputData(project)(addUserId(req))),
    TE.fromEither,
    TE.chain(insertProject)
  )

  const either = await task()

  pipe(
    either,
    E.fold(
      (error) => handleAPIError(res, error),
      () => handleAPIResponse(res, null, "Project added")
    )
  )
})

handler.delete(...auths, createDeleteHandler(deleteProjectById))

handler.patch(...auths, async (req, res) => {
  const task = pipe(
    req,
    checkUser,
    E.chain((req) => validateReqBody<Partial<ProjectModelFromInputType>>(req, ProjectModelSchema.partial())),
    TE.fromEither,
    TE.chain(updateProjectById)
  )

  const either = await task()

  pipe(
    either,
    E.chain((data) => validateData<ProjectModelFromInputType>(data, ProjectModelSchema)),
    E.fold(
      (error) => handleAPIError(res, error),
      (data) => handleAPIResponse(res, data, "Project updated successfully")
    )
  )
})

export default handler
