import useSWR from "swr"
import useSWRImmutable from "swr/immutable"
import { IEventInfo } from "../models/EventInfo"
import { IQuiz } from "../models/Quiz"
import { IQuizResult } from "../models/QuizResult"
import { CourseModelSchemaType } from "../schema/CourseSchema"
import { ProjectModelType } from "../schema/ProjectSchema"
import { UserModelSchemaType } from "../schema/UserSchema"

import { fetcher, fetcherTE } from "./axiosFetcher"
import { TaskModelType } from "../schema/TaskSchema"

// useSWR vs useSWRImmutable
// https://swr.vercel.app/docs/revalidation#disable-automatic-revalidations
// https://stackoverflow.com/questions/73309030/swr-not-pulling-from-cache

// Add fetcherTE to these hooks. Need to handle the data differently in the components tho

export function useCurrentUser() {
  return useSWRImmutable("/api/user", (url) => fetcher<UserModelSchemaType | null, undefined>(url))
}

export const useCourses = () => {
  return useSWR("/api/courses", (url) => fetcher<CourseModelSchemaType[], undefined>(url))
}

export const useTasks = () => {
  return useSWR("/api/tasks", (url) => fetcher<TaskModelType[], undefined>(url))
}

export const useProjects = () => {
  return useSWR("/api/projects", (url) => fetcher<ProjectModelType[], undefined>(url))
}

export const useEvents = () => {
  return useSWR("/api/events", (url) => fetcher<IEventInfo[], undefined>(url))
}

export const useQuizzes = () => {
  return useSWR("/api/quizzes", (url) => fetcher<IQuiz[], undefined>(url))
}

// This will get ALL results. Create a seperate serverless function for user specifik results?
export const useQuizResults = () => {
  return useSWR("/api/quizresults", (url) => fetcher<IQuizResult[], undefined>(url))
}
