import { NextApiRequest, NextApiResponse } from "next"
import nextConnect from "next-connect"
import { z } from "zod"
import auths from "../../../lib/middlewares/auth"
import { getMongoDb } from "../../../lib/mongodb"
import { getTasksForUser, insertTask } from "../../../lib/queries/tasks"
import { handleAPIError, handleAPIResponse } from "../../../lib/utils"
import { TaskFormInputSchema, TaskModelSchema, TaskModelType } from "../../../schema/TaskSchema"

import { Response } from "../../../types/response"

const handler = nextConnect<NextApiRequest, NextApiResponse<Response<TaskModelType[] | null>>>()

handler.get(...auths, async (req, res) => {
  if (!req.user) {
    handleAPIResponse(res, [], "User auth")
    return
  }

  try {
    const db = await getMongoDb()
    const tasks = await getTasksForUser(db, req.user?._id)

    const parsedTasks = z.array(TaskModelSchema).safeParse(tasks)

    if (!parsedTasks.success) {
      return handleAPIError(res, { message: "Validation error" })
    }

    const { data } = parsedTasks

    handleAPIResponse(res, data, `tasks for user: ${req.user?.name}`)
  } catch (error) {
    console.log("Error when fetching tasks")
    handleAPIError(res, error)
  }
})

handler.post(...auths, async (req, res) => {
  if (!req.user) {
    return handleAPIResponse(res, null, "No user found")
  }

  try {
    const db = await getMongoDb()

    const parsedFormInput = TaskFormInputSchema.safeParse(req.body)

    if (!parsedFormInput.success) {
      return handleAPIError(res, { message: "Validation error" })
    }

    const { data } = parsedFormInput

    insertTask(db, {
      ...data,
      userId: req.user?._id,
      createdAt: new Date(),
    })
    handleAPIResponse(res, null, "Task added")
  } catch (error) {
    console.log("Error when inserting Task")
    handleAPIError(res, error)
  }
})
