import { NextApiRequest, NextApiResponse } from "next"
import nextConnect from "next-connect"
import { z } from "zod"
import auths from "../../../lib/middlewares/auth"
import { getMongoDb } from "../../../lib/mongodb"
import { deleteProjectById, getProjectsForUser, insertProject } from "../../../lib/queries/projects"

import { handleAPIError, handleAPIResponse } from "../../../lib/utils"

import { IProjects } from "../../../models/Projects"
import { Response } from "../../../types/response"

const handler = nextConnect<NextApiRequest, NextApiResponse<Response<IProjects[] | null>>>()

handler.get(...auths, async (req, res) => {
  if (!req.user) {
    handleAPIResponse(res, [], "User auth")
    return
  }

  try {
    const db = await getMongoDb()
    const projects = await getProjectsForUser(db, req.user?._id)
    handleAPIResponse(res, projects, `projects for user: ${req.user?.name}`)
  } catch (error) {
    console.log("Error when fetching projects")
    handleAPIError(res, error)
  }
})

handler.post(...auths, async (req, res) => {
  if (!req.user) {
    handleAPIResponse(res, null, "No user found")
  }

  try {
    const db = await getMongoDb()

    const {
      techStack,
      title,
      description,
      deployedUrl,
      sourceCodeUrl,
      shortDescription,
      completed,
    }: IProjects = req.body

    const ProjectsModelSchema = z.object({
      title: z.string().min(1),
      shortDescription: z.string().max(30),
      description: z.string().min(1),
      sourceCodeUrl: z.string().optional(),
      deployedUrl: z.string().optional(),
      techStack: z.array(
        z.object({
          label: z.string(),
        })
      ),
    })

    const result = ProjectsModelSchema.safeParse(req.body)

    if (!result.success) {
      return handleAPIError(res, { message: "Validatation error" })
    }

    insertProject(db, {
      title,
      description,
      techStack,
      userId: req.user?._id,
      createdAt: new Date(),
      sourceCodeUrl,
      deployedUrl,
      shortDescription,
      completed,
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
