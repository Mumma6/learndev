import { type GetServerSideProps } from "next"
import Head from "next/head"
import React from "react"
import { DashboardLayout } from "../../components/dashboard/DashboardLayout"

import { handleAuthGetServerSideProps } from "../../lib/utils"

import Course from "../../components/courses/Course"
import { findCoursebyId } from "../../lib/queries/course"
import { CourseModelSchema, type CourseModelSchemaType } from "../../schema/CourseSchema"

export const getServerSideProps: GetServerSideProps = async (context) =>
  await handleAuthGetServerSideProps<CourseModelSchemaType>(context, findCoursebyId, "course", CourseModelSchema)

// behöver hämta tasks och resources här
const coursePage = ({ course }: { course: CourseModelSchemaType }) => {
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
