import useSWR from "swr"
import useSWRImmutable from "swr/immutable"
import { type IEventInfo } from "../models/EventInfo"
import { type IQuiz } from "../models/Quiz"
import { type IQuizResult } from "../models/QuizResult"
import { type CourseModelSchemaType } from "../schema/CourseSchema"
import { type ProjectModelType } from "../schema/ProjectSchema"
import { type UserModelSchemaType } from "../schema/UserSchema"

import { fetcher } from "./axiosFetcher"
import { type TaskModelType } from "../schema/TaskSchema"
import { type ResourceModelSchemaType } from "../schema/ResourceSchema"

// useSWR vs useSWRImmutable
// https://swr.vercel.app/docs/revalidation#disable-automatic-revalidations
// https://stackoverflow.com/questions/73309030/swr-not-pulling-from-cache

// Add fetcherTE to these hooks. Need to handle the data differently in the components tho

export function useCurrentUser () {
  return useSWRImmutable("/api/user", async (url) => await fetcher<UserModelSchemaType | null, undefined>(url))
}

export const useCourses = () => {
  return useSWR("/api/courses", async (url) => await fetcher<CourseModelSchemaType[], undefined>(url))
}

export const useTasks = () => {
  return useSWR("/api/tasks", async (url) => await fetcher<TaskModelType[], undefined>(url))
}

export const useResources = () => {
  return useSWR("/api/resources", async (url) => await fetcher<ResourceModelSchemaType[], undefined>(url))
}

export const useProjects = () => {
  return useSWR("/api/projects", async (url) => await fetcher<ProjectModelType[], undefined>(url))
}

export const useEvents = () => {
  return useSWR("/api/events", async (url) => await fetcher<IEventInfo[], undefined>(url))
}

export const useQuizzes = () => {
  return useSWR("/api/quizzes", async (url) => await fetcher<IQuiz[], undefined>(url))
}

// This will get ALL results. Create a seperate serverless function for user specifik results?
export const useQuizResults = () => {
  return useSWR("/api/quizresults", async (url) => await fetcher<IQuizResult[], undefined>(url))
}
