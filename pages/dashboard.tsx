import React from "react"
import { useCurrentUser } from "../lib/hooks"

const dashboard = () => {
  const { data: { user } = {}, mutate } = useCurrentUser()

  console.log(user)
  return <div>dashboard</div>
}

export default dashboard
