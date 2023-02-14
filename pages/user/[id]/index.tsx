import React from "react"
import { GetServerSideProps } from "next"
import Head from "next/head"
import { getMongoDb } from "../../../lib/mongodb"
import { findUserById } from "../../../lib/queries/user"
import { ParsedUrlQuery } from "querystring"
import { WithId } from "mongodb"
import { UserModelSchemaType } from "../../../schema/UserSchema"

interface IParams extends ParsedUrlQuery {
  id: string
}

// Detta är en public route som alla kommer åt. Vem som helst kan se användaren.

// Visa en sida likt dashboard här. En överblick över personen.
// en tabell med alla kurser, med länkar osv. Ska se ut som devias saken
// en tabell med alla quizzes + resultat

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

// User type?
const Profile = ({ user }: { user: UserModelSchemaType }) => {
  return (
    <>
      <h2>Profile page for: {user.name}</h2>
      <h1>Show cool stuff similar to the dashboard</h1>
      <p>Download profile as PDF</p>
    </>
  )
}

export default Profile
