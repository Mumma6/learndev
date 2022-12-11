import { NextApiRequest, NextApiResponse } from "next"
import nextConnect from "next-connect"
import { nextConnectOptions } from "../../../lib/lib-utils"
import auths from "../../../lib/middlewares/auth"
import logger from "../../../lib/middlewares/logger"
import session from "../../../lib/middlewares/sessions"
import { getMongoDb } from "../../../lib/mongodb"
import { getCoursesForUser, insertCourse } from "../../../lib/queries/course"
import ApiRequest from "../../../types/ApiRequest"
import { IUser } from "../../../types/user"

const handler = nextConnect(nextConnectOptions)

handler.get(...auths, async (req, res) => {
  if (!req.user) {
    return res.json({ courses: [] })
  }

  const db = await getMongoDb()

  const courses = await getCoursesForUser(db, req.user._id)

  console.log(courses)

  return res.json({ courses })
})

handler.post(...auths, async (req, res) => {
  if (!req.user) {
    return res.json({ user: null })
  }

  const db = await getMongoDb()

  const course = insertCourse(db, {
    content: req.body.content,
    userId: req.user._id,
  })

  return res.json({ course })
})

export default handler
