import Head from "next/head"
import React from "react"
import { DashboardLayout } from "../components/dashboard/DashboardLayout"
import StudyRooms from "../components/studyRooms/StudyRooms"

const studyRooms = () => {
  return (
    <>
      <DashboardLayout>
        <Head>
          <title>Resources</title>
        </Head>
        <StudyRooms />
      </DashboardLayout>
    </>
  )
}

export default studyRooms
