import MongoStore from "connect-mongo"
import nextSession from "next-session"
import { promisifyStore } from "next-session/lib/compat"
import { NextApiRequest, NextApiResponse } from "next"
import { NextResponse } from "next/server"
import { getMongoClient } from "../mongodb"
import { IUser } from "../../types/user"

// Will this create to many connections to the db?
const mongoStore = MongoStore.create({
  clientPromise: getMongoClient(),
  dbName: "dev",
  stringify: false,
})

const getSession = nextSession({
  store: promisifyStore(mongoStore),
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 2 * 7 * 24 * 60 * 60, // 2 weeks,
    path: "/",
    sameSite: "strict",
  },
  touchAfter: 1 * 7 * 24 * 60 * 60, // 1 week
})

export default async function session(req: NextApiRequest, res: NextApiResponse, next: () => NextResponse) {
  await getSession(req, res)
  next()
}
