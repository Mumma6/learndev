import React, { useState, ChangeEvent } from "react"
import { Alert, Form } from "react-bootstrap"
import { fetcher } from "../../lib/fetcher"
import SubmitButton from "../SubmitButton"
import { toast } from "react-toastify"
import Link from "next/link"
import useRedirect from "../customHooks/useRedirect"
import { Status } from "../../types/status"

const ForgotPassword = () => {
  const [status, setStatus] = useState<Status>("idle")
  const [email, setEmail] = useState("")

  const { activateTimer } = useRedirect("/login", 4)

  const onSubmit = async (event: any) => {
    event.preventDefault()
    try {
      setStatus("loading")
      const response = await fetcher("/api/user/password/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
        }),
      })
      console.log(response)
      if (response.error) {
        setStatus("error")
        toast.error(response.error.message)
        setEmail("")
      } else {
        setStatus("success")
        setEmail("")
        activateTimer()
        toast.success(
          `An email has been sent to ${email}. Please follow the link to reset your password. Redirecting to login page`,
          {
            autoClose: 4000,
          }
        )
      }
    } catch (e) {
      setStatus("idle")
      console.error(e)
    }
  }
  return (
    <>
      <h1>Forget password</h1>
      <Form onSubmit={onSubmit}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Enter your email address</Form.Label>
          <Form.Control
            onChange={(event: ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)}
            value={email}
            type="email"
            placeholder=""
          />
        </Form.Group>

        <div className="d-grid gap-2">
          <SubmitButton isLoading={status === "loading"} isDisabled={email === "" || status === "success"} />
        </div>
        <Link href="/login" passHref>
          Return to login
        </Link>
      </Form>
    </>
  )
}

export default ForgotPassword
