import { useRouter } from "next/router"
import React, { useEffect } from "react"
import { useCurrentUser } from "../../lib/hooks"
import { IUser } from "../../types/user"
import EmailVerify from "../auth/EmailVerify"
import AboutYou from "./AboutYou"
import ChangePassword from "./ChangePassword"

const Settings = () => {
  const { data, error, mutate } = useCurrentUser()

  const router = useRouter()
  useEffect(() => {
    if (!data && !error) return
    if (!data?.user) {
      router.replace("/login")
    }
  }, [router, data, error])

  if (!data && !error) return <p>Loadding</p>
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
