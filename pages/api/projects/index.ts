import { NextApiRequest, NextApiResponse } from "next"
import nextConnect from "next-connect"
import { z } from "zod"
import auths from "../../../lib/middlewares/auth"
import { getMongoDb } from "../../../lib/mongodb"
import { deleteProjectById, getProjectsForUser, insertProject } from "../../../lib/queries/projects"

import { handleAPIError, handleAPIResponse } from "../../../lib/utils"
import { ProjectModelFormInputSchema, ProjectModelSchema, ProjectModelType } from "../../../schema/ProjectSchema"

import { Response } from "../../../types/response"

const handler = nextConnect<NextApiRequest, NextApiResponse<Response<ProjectModelType[] | null>>>()

handler.get(...auths, async (req, res) => {
  if (!req.user) {
    handleAPIResponse(res, [], "User auth")
    return
  }

  try {
    const db = await getMongoDb()
    const projects = await getProjectsForUser(db, req.user?._id)

    const parsedProjecs = z.array(ProjectModelSchema).safeParse(projects)

    if (!parsedProjecs.success) {
      return handleAPIError(res, { message: "Validation error" })
    }

    const { data } = parsedProjecs

    console.log(data)

    handleAPIResponse(res, data, `projects for user: ${req.user?.name}`)
  } catch (error) {
    console.log("Error when fetching projects")
    handleAPIError(res, error)
  }
})

handler.post(...auths, async (req, res) => {
  if (!req.user) {
    return handleAPIResponse(res, null, "No user found")
  }

  try {
    const db = await getMongoDb()

    const parsedFormInput = ProjectModelFormInputSchema.safeParse(req.body)

    if (!parsedFormInput.success) {
      console.log(parsedFormInput.error)

      // gör en cool generic function som visar alla felen från valideringen
      return handleAPIError(res, { message: "Validation error" })
    }

    const { data } = parsedFormInput

    const createTags = (data: Pick<ProjectModelType, "techStack" | "title">) =>
      [data.title, ...data.techStack.map((t) => t.label)].map((tag) => tag.toLowerCase()).join(" ,")

    const tags = createTags(data)

    insertProject(db, {
      ...data,
      tags,
      userId: req.user?._id,
      createdAt: new Date(),
    })
    handleAPIResponse(res, null, "Project added")
  } catch (error) {
    console.log("Error when inserting project")
    handleAPIError(res, error)
  }
})

handler.delete(...auths, async (req, res) => {
  if (!req.user) {
    handleAPIResponse(res, null, "No user found")
  }
  if (!req.query.id) {
    handleAPIResponse(res, null, "ID provided")
  }

  try {
    const db = await getMongoDb()
    deleteProjectById(db, req.query.id as string)
    handleAPIResponse(res, null, `Project with id: ${req.query.id} was deleted successfully`)
  } catch (error) {
    console.log("Error when deleting project")
    handleAPIError(res, error)
  }
})

// add post here

export default handler
