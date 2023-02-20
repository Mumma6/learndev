import { IQuiz } from "../../models/Quiz"
import { CourseModelSchemaType } from "../../schema/CourseSchema"
import { ProjectModelType } from "../../schema/ProjectSchema"

export interface ActivitesData {
  id: string | undefined
  name: string
  group: string
}

export const getCourses = (data: CourseModelSchemaType[]): ActivitesData[] => {
  return data
    .filter((d) => !d.completed)
    .map((d) => ({
      id: d._id,
      name: d.content.title,
      group: "Courses",
    }))
}

export const getProjects = (data: ProjectModelType[]): ActivitesData[] => {
  return data
    .filter((d) => !d.completed)
    .map((d) => ({
      id: d._id,
      name: d.title,
      group: "Projects",
    }))
}

export const getQuizzes = (data: IQuiz[], completedQuizzes: string[]): ActivitesData[] => {
  return data
    .filter((d) => !completedQuizzes.includes(d._id.toString()))
    .map((d) => ({
      id: d._id.toString(),
      name: d.title,
      group: "Quizzes",
    }))
}