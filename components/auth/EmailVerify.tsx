import React, { useState } from "react"
import { Alert, Button } from "react-bootstrap"
import { toast } from "react-toastify"
import { fetcher1 } from "../../lib/axiosFetcher"
import { UserModelSchemaType } from "../../schema/UserSchema"
import { Status } from "../../types/status"

const EmailVerify = ({ user }: { user: UserModelSchemaType }) => {
  const [status, setStatus] = useState<Status>("idle")

  const onSubmit = async (event: any) => {
    event.preventDefault()
    try {
      setStatus("loading")
      const response = await fetcher1("/api/user/email/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: {
          userId: user._id,
        },
      })
      if (response.error) {
        setStatus("error")
        toast.error(response.error)
      } else {
        setStatus("success")

        toast.info("An email has been sent to your mailbox. Follow the instruction to verify your email.", {
          autoClose: 4000,
        })
      }
    } catch (e) {
      setStatus("error")
      console.error(e)
    }
  }
  if (user?.emailVerified) return null

  const note = status === "success" ? "An email has been sent to your inbox" : `Your email ${user.email} is not verified`
  return (
    <>
      <Alert variant="info" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {`Note: ${note}`}
        <Button disabled={status === "success" || status === "loading"} onClick={(event) => onSubmit(event)} variant="info">
          Verify
        </Button>
      </Alert>
    </>
  )
}

export default EmailVerify
