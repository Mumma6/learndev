import useSWR from "swr"
import { fetcher } from "./fetcher"

export function useCurrentUser() {
  console.log("use current user")
  return useSWR("/api/user", fetcher)
}

export function useUser(id: string) {
  return useSWR(`/api/users/${id}`, fetcher)
}

/*
user response

{
  "user": {
    "username": "jane",
    "name": "Jane Doe",
    "email": "jane@example.com"
  }
}

*/
