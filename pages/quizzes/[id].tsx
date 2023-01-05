import { GetServerSideProps } from "next"
import Head from "next/head"
import React from "react"
import { DashboardLayout } from "../../components/dashboard/DashboardLayout"
import { getMongoDb } from "../../lib/mongodb"
import { ParsedUrlQuery } from "querystring"
import { findQuizbyId } from "../../lib/queries/quizzes"
import { IQuiz } from "../../models/Quiz"
import Quiz from "../../components/quizzes/Quiz"

interface IParams extends ParsedUrlQuery {
  id: string
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const db = await getMongoDb()

  const { id } = context.params as IParams

  const quiz = await findQuizbyId(db, id)

  if (!quiz) {
    return {
      notFound: true,
    }
  }

  //@ts-ignore
  quiz._id = String(quiz._id) // since ._id of type ObjectId which Next.js cannot serialize

  return {
    props: {
      quiz,
    },
  }
}

const quizePage = ({ quiz }: { quiz: IQuiz }) => {
  return (
    <>
      <DashboardLayout>
        <Head>
          <title>Quiz | {quiz.title}</title>
        </Head>
        <Quiz quiz={quiz} />
      </DashboardLayout>
    </>
  )
}

export default quizePage
