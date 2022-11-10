import React from "react"
import { useCurrentUser } from "../lib/hooks"

const dashboard = () => {
  // Används för att få userdata i protected routes.
  const { data: { user } = {}, mutate } = useCurrentUser()

  console.log(user)
  return (
    <>
      <div>dashboard</div>
      <p>knapp till profile user/_id</p>
    </>
  )
}

export default dashboard
