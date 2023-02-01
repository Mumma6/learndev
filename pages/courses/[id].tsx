import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next"
import Head from "next/head"
import React from "react"
import { DashboardLayout } from "../../components/dashboard/DashboardLayout"

import { handleAuthGetServerSideProps } from "../../lib/utils"
import { ICourse } from "../../models/Course"
import Course from "../../components/courses/Course"
import { findCoursebyId } from "../../lib/queries/course"

export const getServerSideProps: GetServerSideProps = async (context) =>
  handleAuthGetServerSideProps<ICourse>(context, findCoursebyId, "course")

const coursePage = ({ course }: { course: ICourse }) => {
  return (
    <>
      <DashboardLayout>
        <Head>
          <title>Course | {course.content.title}</title>
        </Head>
        <Course course={course} />
      </DashboardLayout>
    </>
  )
}

export default coursePage
