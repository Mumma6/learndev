import { WithId } from "mongodb"
import { NextApiRequest, NextApiResponse } from "next"
import nextConnect from "next-connect"
import auths from "../../../lib/middlewares/auth"
import logger from "../../../lib/middlewares/logger"
import session from "../../../lib/middlewares/sessions"
import { getMongoDb } from "../../../lib/mongodb"
import { deleteCourseById, getCoursesForUser, insertCourse } from "../../../lib/queries/course"
import { ICourse } from "../../../models/course"

import { IUser } from "../../../types/user"

interface ExtendedRequest extends NextApiRequest {
  user: IUser
  body: ICourse
}

interface T {
  message?: string
  error?: string
  payload?: {
    courses?: WithId<ICourse>[]
  }
}

interface ExtendedResponse extends NextApiResponse<T> {}

const handler = nextConnect<ExtendedRequest, ExtendedResponse>()

handler.get(...auths, async (req, res) => {
  if (!req.user) {
    return res.json({ payload: { courses: [] } })
  }

  const db = await getMongoDb()

  const courses = await getCoursesForUser(db, req.user._id)

  return res.json({ payload: { courses } })
})

handler.post(...auths, async (req, res) => {
  if (!req.user) {
    return res.json({ message: "No user found" })
  }

  const db = await getMongoDb()

  insertCourse(db, {
    content: req.body.content,
    userId: req.user._id,
  })

  return res.json({ message: "Course added" })
})

handler.delete(...auths, async (req, res) => {
  if (!req.user) {
    return res.json({ error: "No user found" })
  }

  if (!req.query.id) {
    return res.json({ error: "No ID provided" })
  }

  const db = await getMongoDb()

  deleteCourseById(db, req.query.id as string)

  return res.json({ message: "Course delete" })
})

export default handler
