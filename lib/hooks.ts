import useSWR, { SWRResponse } from "swr"
import useSWRImmutable from "swr/immutable"
import { ICourse } from "../models/Course"
import { IUser } from "../types/user"
import { fetcher1 } from "./axiosFetcher"
import { fetcher } from "./fetcher"

// useSWR vs useSWRImmutable
// https://swr.vercel.app/docs/revalidation#disable-automatic-revalidations
// https://stackoverflow.com/questions/73309030/swr-not-pulling-from-cache

export function useCurrentUser() {
  return useSWRImmutable("/api/user", fetcher1<IUser | null, unknown>)
}

export function useUser(id: string) {
  return useSWR(`/api/users/${id}`, fetcher)
}

export const useCourses = () => {
  return useSWR("/api/courses", fetcher1<ICourse[], unknown>)
}
