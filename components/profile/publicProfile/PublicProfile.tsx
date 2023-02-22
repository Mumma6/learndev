import React from "react"
import { IQuiz } from "../../../models/Quiz"
import { IQuizResult } from "../../../models/QuizResult"
import { CourseModelSchemaType } from "../../../schema/CourseSchema"
import { ProjectModelType } from "../../../schema/ProjectSchema"
import { UserModelSchemaType } from "../../../schema/UserSchema"

// https://www.npmjs.com/package/react-to-pdf

/*

Visa user saker först,
bio
lookingForJob flag
goals
work exp
skills

tabel med kurser
tabel med projects
tabel med quiz results

knappar till socials


*/

interface IProps {
  user: UserModelSchemaType
  courses: CourseModelSchemaType[]
  projects: ProjectModelType[]
  quizResults: IQuizResult[]
  quizzes: IQuiz[]
}

const PublicProfile = ({ user, courses, projects, quizResults, quizzes }: IProps) => {
  console.log("user")
  console.log(user)

  console.log("courses")
  console.log(courses)

  console.log("projects")
  console.log(projects)

  console.log("quizResults")
  console.log(quizResults)

  console.log("quizzes")
  console.log(quizzes)

  return <div>PublicProfile</div>
}

export default PublicProfile
