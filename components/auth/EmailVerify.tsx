import { Alert, Button } from "@mui/material"
import React, { FormEvent, useState } from "react"
import { toast } from "react-toastify"
import { fetcher, fetcherTE } from "../../lib/axiosFetcher"
import { UserModelSchemaType } from "../../schema/UserSchema"
import { Status } from "../../types/status"
import { pipe } from "fp-ts/function"
import * as TE from "fp-ts/TaskEither"

const EmailVerify = ({ user }: { user: UserModelSchemaType }) => {
  const [status, setStatus] = useState<Status>("idle")

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    pipe(
      fetcherTE("/api/user/email/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: {
          userId: user._id,
        },
      }),
      TE.fold(
        (error) => {
          setStatus("error")
          toast.error(error)
          return TE.left(error)
        },
        (data) => {
          setStatus("success")
          toast.info("An email has been sent to your mailbox. Follow the instruction to verify your email.", {
            autoClose: 4000,
          })
          return TE.right(data)
        }
      )
    )()
  }

  if (user.emailVerified) {
    return null
  }

  const note = status === "success" ? "An email has been sent to your inbox" : `Your email ${user.email} is not verified`
  return (
    <>
      <Alert
        severity="info"
        action={
          <Button
            disabled={status === "success" || status === "loading"}
            onClick={(event) => onSubmit(event)}
            variant="contained"
            sx={{ margin: 1 }}
          >
            Verify
          </Button>
        }
      >
        {`Note: ${note}`}
      </Alert>
    </>
  )
}

export default EmailVerify
