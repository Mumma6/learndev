import React from "react"
import { GetServerSideProps } from "next"
import Head from "next/head"
import { getMongoDb } from "../../../lib/mongodb"
import { findUserById } from "../../../lib/queries/user"
import { ParsedUrlQuery } from "querystring"

interface IParams extends ParsedUrlQuery {
  id: string
}

// Detta är en public route som alla kommer åt. Vem som helst kan se användaren.

export const getServerSideProps: GetServerSideProps = async (context) => {
  const db = await getMongoDb()

  const { id } = context.params as IParams

  const user = await findUserById(db, id)

  if (!user) {
    return {
      notFound: true,
    }
  }

  //@ts-ignore
  user._id = String(user._id) // since ._id of type ObjectId which Next.js cannot serialize
  return {
    props: {
      user,
    },
  }
}

const index = () => {
  return <div>index</div>
}

export default index
