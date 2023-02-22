import React from "react"
import { GetServerSideProps } from "next"
import Head from "next/head"
import { getMongoDb } from "../../../lib/mongodb"
import { findUserById } from "../../../lib/queries/user"
import { ParsedUrlQuery } from "querystring"
import { WithId } from "mongodb"
import { UserModelSchema, UserModelSchemaType } from "../../../schema/UserSchema"
import { getCoursesForUser } from "../../../lib/queries/course"
import { getProjectsForUser } from "../../../lib/queries/projects"
import { getAllQuizzes, getQuizResultsForUser } from "../../../lib/queries/quizzes"
import { CourseModelSchema, CourseModelSchemaType } from "../../../schema/CourseSchema"
import { z } from "zod"
import { ProjectModelSchema, ProjectModelType } from "../../../schema/ProjectSchema"
import { IQuiz } from "../../../models/Quiz"
import PublicProfile from "../../../components/profile/publicProfile/PublicProfile"
import { IQuizResult } from "../../../models/QuizResult"
import { serilizeObject } from "../../../lib/utils"

interface IParams extends ParsedUrlQuery {
  id: string
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const db = await getMongoDb()

  const { id } = context.params as IParams

  const user = await findUserById(db, id)

  const parsedUser = UserModelSchema.omit({ password: true }).safeParse(user)

  if (!user || !parsedUser.success) {
    return {
      notFound: true,
    }
  }

  const userCourses = z.array(CourseModelSchema).safeParse(await getCoursesForUser(db, parsedUser.data._id))
  const userProjects = z.array(ProjectModelSchema).safeParse(await getProjectsForUser(db, parsedUser.data._id))
  const userQuizResults = (await getQuizResultsForUser(db, parsedUser.data._id)).map(serilizeObject) as IQuizResult[]

  const userQuizzes = (await getAllQuizzes(db))
    .filter((quiz) => userQuizResults.map((q) => q.quiz_id).includes(quiz._id.toString()))
    .map(serilizeObject)

  if (!userCourses.success || !userProjects.success) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      user: parsedUser.data,
      courses: userCourses.data,
      projects: userProjects.data,
      quizResults: userQuizResults,
      quizzes: userQuizzes,
    },
  }
}

interface IProps {
  user: UserModelSchemaType
  courses: CourseModelSchemaType[]
  projects: ProjectModelType[]
  quizResults: IQuizResult[]
  quizzes: IQuiz[]
}

const Profile = ({ user, courses, projects, quizResults, quizzes }: IProps) => {
  return (
    <>
      <Head>
        <title>Profile | {user.name}</title>
      </Head>
      <PublicProfile user={user} courses={courses} projects={projects} quizResults={quizResults} quizzes={quizzes} />
    </>
  )
}

export default Profile
