import { type GetServerSidePropsContext, type NextApiRequest, type NextApiResponse } from "next"
import { type Response } from "../types/response"
import { getMongoDb } from "./mongodb"
import { findUserBySession } from "./queries/user"
import { type ParsedUrlQuery } from "querystring"
import { type Db, type DeleteResult } from "mongodb"
import { type AnyZodObject, z } from "zod"
import * as E from "fp-ts/Either"
import { flow, pipe } from "fp-ts/function"
import * as TE from "fp-ts/TaskEither"

/*
 ***** Only used on the server side.

 https://www.youtube.com/watch?v=mw97Dum7TnM&ab_channel=RyanDavisDev

 Use smart constructs instead of E.right | E.left

 // todo- Make all validate functions partial.

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

// Add the error to a logs collection here?
export const handleAPIError = (res: NextApiResponse, error: any): void => {
  res.statusCode = 400
  res.json({ payload: null, error: error.message, message: error || "An error occurred" })
}

interface IParams extends ParsedUrlQuery {
  id: string
}

export const serilizeObject = (obj: Object) => JSON.parse(JSON.stringify(obj))

// This function will check if there is a valid session for the user in the database. It will check the "cookies" in the browser.
export const handleAuthGetServerSideProps = async <ObjectType>(
  context: GetServerSidePropsContext,
  findObjectById: (db: Db, id: string) => Promise<ObjectType | null>,
  objectName: string,
  schema?: AnyZodObject
) => {
  // eslint-disable-next-line no-lone-blocks
  {
    const redirect = {
      redirect: {
        destination: "/",
        permanent: false
      }
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
        [objectName]: serilizeObject(object) // nextjs cant serilize ObjectId, need to convert to Id
      }
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

export const addUserId = (req: NextApiRequest) =>
  pipe(
    req,
    getUserId,
    E.getOrElse(() => "")
  )

export const validateAndGetUserId = flow(checkUser, E.chain(getUserId), TE.fromEither)

/**
 *
 * @param data any data object to parse
 * @param schema any valid zodSchema
 * @typedef T the expected return type of the parsed data
 * @returns Either the parsed data as array<T> or an error message
 */
export const validateArrayData = <T>(data: unknown[], schema: z.ZodSchema): E.Either<string, T[]> => {
  const parsedData = z.array(schema).safeParse(data)
  return parsedData.success ? E.right(parsedData.data) : E.left("Error while parsing data")
}

export const validateArrayData2 =
  <T>(schema: z.ZodSchema) =>
    (data: unknown[]): TE.TaskEither<string, T[]> => {
      const parsedData = z.array(schema).safeParse(data)
      return parsedData.success ? TE.right(parsedData.data) : TE.left("Error while parsing data")
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

// We use currying so we dont need to pass the parameter in the pipe steps
/*
E.chain((req) => validateReqBody<Partial<CourseModelSchemaType>>(req, CourseModelSchema.partial())),

E.chain(validateReqBody2<TaskFormInputType>(TaskFormInputSchema)),
*/
export const validateReqBody2 =
  <T>(schema: z.ZodSchema) =>
    (req: NextApiRequest): E.Either<string, T> => {
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

export const validateData2 =
  <T>(schema: z.ZodSchema) =>
    (data: unknown): E.Either<string, T> => {
      console.log(data)
      const parsedData = schema.safeParse(data)
      console.log(parsedData)
      return parsedData.success ? E.right(parsedData.data) : E.left("Error while parsing req data")
    }

/**
 *
 * @param req
 * @returns Either the query.id as a string or an error message
 */
export const validateQueryParam = (req: NextApiRequest): E.Either<string, string> =>
  !Array.isArray(req.query.id) && req.query.id !== undefined ? E.right(req.query.id) : E.left("No ID provided")

// Should be able to create a getHandler aswell?
export const createDeleteHandler =
  (deleteFunction: (id: string) => TE.TaskEither<string, DeleteResult>) =>
    async (req: NextApiRequest, res: NextApiResponse) => {
      const task = pipe(req, checkUser, E.chain(validateQueryParam), TE.fromEither, TE.chain(deleteFunction))

      const either = await task()

      pipe(
        either,
        E.fold(
          (error) => { handleAPIError(res, { message: error }) },
          () => { handleAPIResponse(res, null, "Resource was deleted successfully") }
        )
      )
    }
