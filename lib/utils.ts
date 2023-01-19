import { GetServerSidePropsContext, NextApiResponse } from "next"
import { Response } from "../types/response"
import { getMongoDb } from "./mongodb"
import { findUserBySession } from "./queries/user"
import { ParsedUrlQuery } from "querystring"
import { Db, ObjectId, WithId } from "mongodb"

/*
Update to function to include a status code aswell

*/

export const handleAPIResponse = <T>(
  res: NextApiResponse<Response<T>>,
  payload: T,
  message: string,
  statusCode = 200
): void => {
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

// This function will check if there is a valid session for the user in the database. It will check the "cookies" in the browser.
export const handleAuthGetServerSideProps = async <ObjectType>(
  context: GetServerSidePropsContext,
  findObjectById: (db: Db, id: string) => Promise<WithId<ObjectType> | null>,
  objectName: string
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
        [objectName]: { ...convertMongoIdToString(object) }, // nextjs cant serilize ObjectId, need to convert to Id
      },
    }
  }
}
