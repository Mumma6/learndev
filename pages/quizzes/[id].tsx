import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next"
import Head from "next/head"
import React from "react"
import { DashboardLayout } from "../../components/dashboard/DashboardLayout"
import { findQuizbyId } from "../../lib/queries/quizzes"
import { IQuiz } from "../../models/Quiz"
import Quiz from "../../components/quizzes/Quiz"
import { handleAuthGetServerSideProps } from "../../lib/utils"

export const getServerSideProps: GetServerSideProps = async (context) =>
  handleAuthGetServerSideProps<IQuiz>(context, findQuizbyId, "quiz")

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
