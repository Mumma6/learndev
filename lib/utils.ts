import { GetServerSidePropsContext, NextApiResponse, NextApiRequest } from "next"
import { Response } from "../types/response"
import { getMongoDb } from "./mongodb"
import { findUserBySession } from "./queries/user"
import { ParsedUrlQuery } from "querystring"
import { Db, ObjectId, WithId } from "mongodb"
import { AnyZodObject, z } from "zod"
import * as E from "fp-ts/Either"

/*
Only used on the server side.

*/

export const handleAPIResponse = <T>(
  res: NextApiResponse<Response<T>>,
  payload: T,
  message: string,
  statusCode = 200
): void => {
  /*

  The payload contains _id: Mongodb ID here. 
  But will get converted to a string by JSON.
  https://stackoverflow.com/questions/39598987/id-get-converted-from-objectid-to-string-in-mean-application

  */
  res.statusCode = statusCode
  res.json({ payload, error: null, message })
}

export const handleAPIError = (res: NextApiResponse, error: any): void => {
  res.statusCode = 400
  res.json({ payload: null, error: error.message, message: error || "An error occurred" })
}

interface IParams extends ParsedUrlQuery {
  id: string
}

const convertMongoIdToString = <T>(obj: T): T => {
  const checkIfObjectId = (val: any) => val instanceof ObjectId
  const convertToString = (val: any): string => val.toString()

  if (checkIfObjectId(obj)) {
    return convertToString(obj) as any
  }
  if (Array.isArray(obj)) {
    return obj.map(convertMongoIdToString) as any
  }
  if (typeof obj !== "object" || obj === null) {
    return obj
  }
  const newObj = { ...obj }
  for (const key in newObj) {
    newObj[key] = convertMongoIdToString(newObj[key])
  }

  return newObj
}

export const serilizeObject = (obj: Object) => JSON.parse(JSON.stringify(obj))

// This function will check if there is a valid session for the user in the database. It will check the "cookies" in the browser.
export const handleAuthGetServerSideProps = async <ObjectType>(
  context: GetServerSidePropsContext,
  findObjectById: (db: Db, id: string) => Promise<ObjectType | null>,
  objectName: string,
  schema?: AnyZodObject
) => {
  {
    const redirect = {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }
    const sessionId = context.req.cookies.sid

    if (!sessionId) {
      return redirect
    }

    const db = await getMongoDb()
    const user = await findUserBySession(db, sessionId)

    if (!user) {
      return redirect
    }

    const { id } = context.params as IParams
    const object = await findObjectById(db, id)

    if (!object) {
      return redirect
    }

    return {
      props: {
        [objectName]: serilizeObject(object), // nextjs cant serilize ObjectId, need to convert to Id
      },
    }
  }
}

/**
 *
 * @param req
 * @returns Either the NextApiRequest object or an error message
 */
export const checkUser = (req: NextApiRequest): E.Either<string, NextApiRequest> =>
  req.user ? E.right(req) : E.left("No user found")

/**
 *
 * @param req
 * @returns Either the user_id or an error message
 */
export const getUserId = (req: NextApiRequest): E.Either<string, string> =>
  req.user?._id ? E.right(req.user._id) : E.left("User id not found")

/**
 *
 * @param data any data object to parse
 * @param schema any valid zodSchema
 * @typedef T the expected return type of the parsed data
 * @returns Either the parsed data as array<T> or an error message
 */
export const validateArrayData = <T>(data: unknown, schema: z.ZodSchema): E.Either<string, T[]> => {
  const parsedData = z.array(schema).safeParse(data)
  return parsedData.success ? E.right(parsedData.data) : E.left("Error while parsing data")
}

/**
 *
 * @param req The NextApiRequestObject
 * @param schema any valid zodSchema
 * @typedef T the expected return type of the parsed data
 * @returns Either the parsed data as <T> or an error message
 */
export const validateReqBody = <T>(req: NextApiRequest, schema: z.ZodSchema): E.Either<string, T> => {
  const parsedBody = schema.safeParse(req.body)
  return parsedBody.success ? E.right(parsedBody.data) : E.left("Error while parsing req data")
}

/**
 *
 * @param req The NextApiRequestObject
 * @param schema any valid zodSchema
 * @typedef T the expected return type of the parsed data
 * @returns Either the parsed data as <T> or an error message
 */
export const validateData = <T>(data: unknown, schema: z.ZodSchema): E.Either<string, T> => {
  const parsedData = schema.safeParse(data)
  return parsedData.success ? E.right(parsedData.data) : E.left("Error while parsing req data")
}

/**
 *
 * @param req
 * @returns Either the query.id as a string or an error message
 */
export const validateQueryParam = (req: NextApiRequest): E.Either<string, string> =>
  !Array.isArray(req.query.id) && req.query.id !== undefined ? E.right(req.query.id) : E.left("No ID provided")
