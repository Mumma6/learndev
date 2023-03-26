import { GetServerSidePropsContext, NextApiResponse } from "next"
import { Response } from "../types/response"
import { getMongoDb } from "./mongodb"
import { findUserBySession } from "./queries/user"
import { ParsedUrlQuery } from "querystring"
import { Db, ObjectId, WithId } from "mongodb"
import { AnyZodObject } from "zod"

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
  res.json({ payload: null, error: error.message, message: "An error occurred" })
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
