import { NextApiRequest, NextApiResponse } from "next"
import nextConnect from "next-connect"
import auths from "../../../lib/middlewares/auth"

import { getMongoDb } from "../../../lib/mongodb"

import { addEventForUser, deleteEventById, getEventsForUser } from "../../../lib/queries/events"
import { handleAPIError, handleAPIResponse } from "../../../lib/utils"
import { IEventInfo } from "../../../models/EventInfo"
import { Response } from "../../../types/response"

const handler = nextConnect<NextApiRequest, NextApiResponse<Response<IEventInfo[] | null>>>()

handler.get(...auths, async (req, res) => {
  if (!req.user) {
    return handleAPIResponse(res, null, "No user found")
  }
  try {
    const db = await getMongoDb()
    const events = await getEventsForUser(db, req.user?._id)

    handleAPIResponse(res, events, `events for user: ${req.user?.name}`)
  } catch (error) {
    console.log("Error when fethcing events")
    handleAPIError(res, error)
  }
})

handler.post(...auths, async (req, res) => {
  if (!req.user) {
    return handleAPIResponse(res, null, "No user found")
  }
  try {
    const db = await getMongoDb()
    addEventForUser(db, req.body, req.user?._id)
    handleAPIResponse(res, null, "Event added")
  } catch (error) {
    console.log("Error when inserting event")
    handleAPIError(res, error)
  }
})

handler.delete(...auths, async (req, res) => {
  if (!req.query._id) {
    handleAPIResponse(res, null, "ID provided")
  }

  try {
    const db = await getMongoDb()
    deleteEventById(db, req.query._id as string)
    handleAPIResponse(res, null, `Event deleted successfully`)
  } catch (error) {
    console.log("Error when deleting course")
    handleAPIError(res, error)
  }
})

export default handler
