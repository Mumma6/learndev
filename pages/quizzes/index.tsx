import Head from "next/head"
import React from "react"
import { DashboardLayout } from "../../components/dashboard/DashboardLayout"
import Quizzes from "../../components/quizzes/Quizzes"

const quizzes = () => {
  return (
    <>
      <DashboardLayout>
        <Head>
          <title>Quizzes</title>
        </Head>
        <Quizzes />
      </DashboardLayout>
    </>
  )
}

export default quizzes
