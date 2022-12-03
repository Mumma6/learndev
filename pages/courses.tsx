import Head from "next/head"
import React from "react"
import Courses from "../components/courses/Courses"
import { DashboardLayout } from "../components/dashboard/DashboardLayout"

const courses = () => {
  return (
    <>
      <DashboardLayout>
        <Head>
          <title>Courses</title>
        </Head>
        <Courses />
      </DashboardLayout>
    </>
  )
}

export default courses
