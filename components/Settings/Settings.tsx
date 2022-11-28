import { useRouter } from "next/router"
import React, { useEffect } from "react"
import { useCurrentUser } from "../../lib/hooks"
import { IUser } from "../../types/user"
import EmailVerify from "../auth/EmailVerify"
import AboutYou from "./AboutYou"
import ChangePassword from "./ChangePassword"

const Settings = () => {
  const { data, error, mutate } = useCurrentUser()
  console.log("calling settings.tsx")

  return (
    <>
      <p>Settings page</p>
      <EmailVerify user={data.user} />
      <AboutYou user={data.user} mutate={mutate} />
      <ChangePassword />
    </>
  )
}

export default Settings
