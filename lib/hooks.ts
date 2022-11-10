import useSWR from "swr"
import { fetcher } from "./fetcher"

// TODO

// Add a SWR cache to avoid unnacassary network calls
// https://swr.vercel.app/docs/advanced/cache

export function useCurrentUser() {
  console.log("use current user, borde inte köra om varje render")
  return useSWR("/api/user", fetcher)
}

export function useUser(id: string) {
  return useSWR(`/api/users/${id}`, fetcher)
}
