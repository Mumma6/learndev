import useSWR, { SWRResponse } from "swr"
import useSWRImmutable from "swr/immutable"
import { ICourse } from "../models/Course"
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
