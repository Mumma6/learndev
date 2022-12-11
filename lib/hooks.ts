import useSWR from "swr"
import useSWRImmutable from "swr/immutable"
import { fetcher } from "./fetcher"

// useSWR vs useSWRImmutable
// https://swr.vercel.app/docs/revalidation#disable-automatic-revalidations
// https://stackoverflow.com/questions/73309030/swr-not-pulling-from-cache

export function useCurrentUser() {
  return useSWRImmutable("/api/user", fetcher)
}

export function useUser(id: string) {
  return useSWR(`/api/users/${id}`, fetcher)
}

export interface ICoursesData {
  content: {
    title: string
    description: string
    url: string
    institution: string
  }
  createdAt: string
  userId: string
  _id: string
}

export interface ICourses {
  courses: ICoursesData[]
}

export const useCourses = () => {
  return useSWR<ICourses>("/api/courses", fetcher)
}
