import useSWR, { SWRResponse } from "swr"
import useSWRImmutable from "swr/immutable"
import { ICourse } from "../models/Course"
import { IEventInfo } from "../models/EventInfo"
import { IProjects } from "../models/Projects"
import { IQuiz } from "../models/Quiz"
import { IQuizResult } from "../models/QuizResult"
import { Response } from "../types/response"
import { IUser } from "../types/user"
import { fetcher1 } from "./axiosFetcher"
import { fetcher } from "./fetcher"

// useSWR vs useSWRImmutable
// https://swr.vercel.app/docs/revalidation#disable-automatic-revalidations
// https://stackoverflow.com/questions/73309030/swr-not-pulling-from-cache

interface UserHookResponse {
  data?: Response<IUser | null> | undefined
  mutate: (newData: Response<IUser | null>, b?: boolean) => void
}

export function useCurrentUser() {
  return useSWRImmutable("/api/user", (url) => fetcher1<IUser | null, undefined>(url))
}

export function useUser(id: string) {
  return useSWR(`/api/users/${id}`, fetcher)
}

export const useCourses = () => {
  return useSWR("/api/courses", (url) => fetcher1<ICourse[], undefined>(url))
}

export const useProjects = () => {
  return useSWR("/api/projects", (url) => fetcher1<IProjects[], undefined>(url))
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
