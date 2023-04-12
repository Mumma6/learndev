import React from "react"
import { GetServerSideProps } from "next"
import Head from "next/head"
import { getMongoDb } from "../../../lib/mongodb"
import { findUserById } from "../../../lib/queries/user"
import { ParsedUrlQuery } from "querystring"
import { ObjectId, WithId } from "mongodb"
import { UserModelSchema, UserModelSchemaType } from "../../../schema/UserSchema"

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
  // replace all this nonsens with pipes
  const db = await getMongoDb()

  const { id } = context.params as IParams

  const user = await findUserById(db, id)

  const parsedUser = UserModelSchema.omit({ password: true }).safeParse(user)

  if (!user || !parsedUser.success) {
    console.log("return not found")
    return {
      notFound: true,
    }
  }

  const getC = async (id: string) => {
    const db = await getMongoDb()
    return await db
      .collection("courses")
      .find({ userId: new ObjectId(id) })
      .sort({ createdAt: -1, title: 1 })
      .toArray()
  }

  const getP = async (id: string) => {
    const db = await getMongoDb()
    return await db
      .collection("projects")
      .find({ userId: new ObjectId(id) })
      .sort({ createdAt: -1, title: 1 })
      .toArray()
  }

  const userCourses = z.array(CourseModelSchema).safeParse(await getC(parsedUser.data._id))
  const userProjects = z.array(ProjectModelSchema).safeParse(await getP(parsedUser.data._id))
  const userQuizResults = (await getQuizResultsForUser(db, parsedUser.data._id)).map(serilizeObject) as IQuizResult[]

  if (!userCourses.success || !userProjects.success) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      user: serilizeObject(parsedUser.data),
      courses: serilizeObject(userCourses.data),
      projects: serilizeObject(userProjects.data),
      quizResults: userQuizResults,
    },
  }
}

interface IProps {
  user: UserModelSchemaType
  courses: CourseModelSchemaType[]
  projects: ProjectModelType[]
  quizResults: IQuizResult[]
}

const Profile = ({ user, courses, projects, quizResults }: IProps) => {
  return (
    <>
      <Head>
        <title>Profile | {user.name}</title>
      </Head>
      <PublicProfile user={user} courses={courses} projects={projects} quizResults={quizResults} />
    </>
  )
}

export default Profile

/*
import * as E from 'fp-ts/lib/Either';
import * as TE from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/lib/function';
import { ObjectId } from 'mongodb';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as IParams;

  const userOrNotFound = await pipe(
    getMongoDb(),
    TE.chain((db) => findUserById(db, id)),
    TE.chain((user) => {
      const parsedUser = UserModelSchema.omit({ password: true }).safeParse(user);
      return parsedUser.success
        ? TE.right(serilizeObject(parsedUser.data))
        : TE.left({ notFound: true });
    }),
    TE.toUnion
  )();

  const coursesOrNotFound = await pipe(
    getC(id),
    TE.chain((courses) =>
      pipe(
        z.array(CourseModelSchema).safeParse(courses),
        E.map(serilizeObject),
        E.mapLeft(() => ({ notFound: true }))
      )
    ),
    TE.toUnion
  )();

  const projectsOrNotFound = await pipe(
    getMongoDb(),
    TE.chain((db) => getProjectsForUser(db, id)),
    TE.chain((projects) =>
      pipe(
        z.array(ProjectModelSchema).safeParse(projects),
        E.map(serilizeObject),
        E.mapLeft(() => ({ notFound: true }))
      )
    ),
    TE.toUnion
  )();

  const quizResults = await pipe(
    getMongoDb(),
    TE.chain((db) => getQuizResultsForUser(db, id)),
    TE.map((results) => results.map(serilizeObject))
  )();

  const quizzes = await pipe(
    getAllQuizzes(db),
    TE.map((allQuizzes) =>
      allQuizzes
        .filter((quiz) => quizResults.map((q) => q.quiz_id).includes(quiz._id.toString()))
        .map(serilizeObject)
    )
  )();

  return {
    props: pipe(
      userOrNotFound,
      E.map((user) => ({
        user,
        courses: coursesOrNotFound,
        projects: projectsOrNotFound,
        quizResults,
        quizzes,
      })),
      E.getOrElse(() => ({ notFound: true }))
    ),
  };
};
*/
