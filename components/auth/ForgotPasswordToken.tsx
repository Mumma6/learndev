import React, { useState, ChangeEvent } from "react"
import { Alert, Form } from "react-bootstrap"
import { fetcher } from "../../lib/fetcher"
import SubmitButton from "../SubmitButton"
import { toast } from "react-toastify"
import Link from "next/link"
import useRedirect from "../customHooks/useRedirect"

type Status = "success" | "loading" | "idle" | "error"

const ForgotPasswordToken = ({ valid, token }: { valid: boolean; token: any }) => {
  const [status, setStatus] = useState<Status>("idle")
  const [newPassword, setNewPassword] = useState("")

  const { activateTimer } = useRedirect("/login", 4)

  const onSubmit = async (e: any) => {
    e.preventDefault()
    try {
      setStatus("loading")
      const response = await fetcher("/api/user/password/reset", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          password: newPassword,
        }),
      })
      console.log(response)
      if (response.error) {
        setStatus("error")
        toast.error(response.error)
        setNewPassword("")
      } else {
        setStatus("success")
        setNewPassword("")
        activateTimer()
        toast.success("Your password has been updated successfully. Redirecting to login page", {
          autoClose: 4000,
        })
      }
    } catch (e) {
      setStatus("idle")
      console.error(e)
    }
  }

  return (
    <>
      {!valid ? (
        <>
          <h1>Invalid link</h1>
          <p>Looks like you have cliked on an invalid link. Please close this window and try again</p>
          <Link href="/login" passHref>
            Return to login
          </Link>
        </>
      ) : (
        <>
          <h1>Reset password</h1>
          <Form onSubmit={onSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Enter a new password for your account</Form.Label>
              <Form.Control
                onChange={(event: ChangeEvent<HTMLInputElement>) => setNewPassword(event.target.value)}
                value={newPassword}
                type="password"
                placeholder=""
              />
            </Form.Group>

            <div className="d-grid gap-2">
              <SubmitButton text="Submit" isLoading={status === "loading"} isDisabled={newPassword === "" || status === "success"} />
            </div>
            <Link href="/login" passHref>
              Return to login
            </Link>
          </Form>
        </>
      )}
    </>
  )
}

export default ForgotPasswordToken
