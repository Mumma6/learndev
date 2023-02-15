import useSWR, { SWRResponse } from "swr"
import useSWRImmutable from "swr/immutable"
import { IEventInfo } from "../models/EventInfo"
import { IQuiz } from "../models/Quiz"
import { IQuizResult } from "../models/QuizResult"
import { CourseModelSchemaType } from "../schema/CourseSchema"
import { ProjectModelType } from "../schema/ProjectSchema"
import { UserModelSchemaType } from "../schema/UserSchema"
import { Response } from "../types/response"
import { fetcher1 } from "./axiosFetcher"
import { fetcher } from "./fetcher"

// useSWR vs useSWRImmutable
// https://swr.vercel.app/docs/revalidation#disable-automatic-revalidations
// https://stackoverflow.com/questions/73309030/swr-not-pulling-from-cache

// Zod will replace all Interfaces. Make sure the hooks still work with the infer type

export function useCurrentUser() {
  return useSWRImmutable("/api/user", (url) => fetcher1<UserModelSchemaType | null, undefined>(url))
}

export function useUser(id: string) {
  return useSWR(`/api/users/${id}`, fetcher)
}

export const useCourses = () => {
  return useSWR("/api/courses", (url) => fetcher1<CourseModelSchemaType[], undefined>(url))
}

export const useProjects = () => {
  return useSWR("/api/projects", (url) => fetcher1<ProjectModelType[], undefined>(url))
}

export const useEvents = () => {
  return useSWR("/api/events", (url) => fetcher1<IEventInfo[], undefined>(url))
}

export const useQuizzes = () => {
  return useSWR("/api/quizzes", (url) => fetcher1<IQuiz[], undefined>(url))
}

// This will get ALL results. Create a seperate serverless function for user specifik results?
export const useQuizResults = () => {
  return useSWR("/api/quizresults", (url) => fetcher1<IQuizResult[], undefined>(url))
}
