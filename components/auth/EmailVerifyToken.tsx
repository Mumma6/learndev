import Link from "next/link"
import React, { useEffect } from "react"
import { toast } from "react-toastify"
import useRedirect from "../customHooks/useRedirect"

const EmailVerifyToken = ({ valid }: { valid: boolean }) => {
  const { activateTimer } = useRedirect("/settings", 4)

  useEffect(() => {
    if (valid) {
      activateTimer()
      toast.success(`Thank you for verifying your email. Redirecting to settings page`, {
        autoClose: 4000,
      })
    }
  }, [valid])
  return (
    <>
      {!valid ? (
        <>
          <h1>Invalid link</h1>
          <p>Looks like you have cliked on an invalid link. Please close this window and try again</p>
          <Link href="/settings" passHref>
            Return to settings
          </Link>
        </>
      ) : (
        <>
          <h1>Thank you for verifying your email. You may close this page.</h1>
          <Link href="/settings" passHref>
            Go back home
          </Link>
        </>
      )}
    </>
  )
}

export default EmailVerifyToken
