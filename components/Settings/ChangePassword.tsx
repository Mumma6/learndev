import React, { useState, ChangeEvent, FormEvent, useEffect } from "react"
import { Form } from "react-bootstrap"
import { toast } from "react-toastify"
import { fetcher } from "../../lib/fetcher"
import SubmitButton from "../SubmitButton"
import Alert from "react-bootstrap/Alert"

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmNewPassword, setConfirmNewPassword] = useState("")

  const [displayPasswordAlert, setDisplayPasswordAlert] = useState(false)

  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (newPassword !== confirmNewPassword) {
      setDisplayPasswordAlert(true)
    } else {
      setDisplayPasswordAlert(false)
    }
  }, [confirmNewPassword])

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      setIsLoading(true)
      const response = await fetcher("/api/user/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          oldPassword,
          newPassword,
        }),
      })

      console.log(response)

      if (response.error) {
        console.log(response)
        setIsLoading(false)
        toast.success(response.error.message)
        setOldPassword("")
        setNewPassword("")
      } else {
        setIsLoading(false)
        toast.success(response.message)
      }
    } catch (e: any) {
      console.log(e)
      toast.error(e.message)
    }
  }
  return (
    <>
      <h1 style={{ marginTop: 50 }}>Change password</h1>
      <Form onSubmit={onSubmit}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Old password</Form.Label>
          <Form.Control
            onChange={(event: ChangeEvent<HTMLInputElement>) => setOldPassword(event.target.value)}
            value={oldPassword}
            type="password"
            placeholder=""
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>New password</Form.Label>
          <Form.Control
            onChange={(event: ChangeEvent<HTMLInputElement>) => setNewPassword(event.target.value)}
            value={newPassword}
            type="password"
            placeholder=""
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Form.Label>Confirm new password</Form.Label>
            {displayPasswordAlert && (
              <Alert
                style={{ marginBottom: 6, paddingTop: 0, paddingBottom: 0, paddingLeft: 50, paddingRight: 50 }}
                variant="danger"
              >
                New password dosent match
              </Alert>
            )}
          </div>
          <Form.Control
            onChange={(event: ChangeEvent<HTMLInputElement>) => setConfirmNewPassword(event.target.value)}
            value={confirmNewPassword}
            type="password"
            placeholder=""
          />
        </Form.Group>

        <div className="d-grid gap-2">
          <SubmitButton isLoading={isLoading} isDisabled={oldPassword === "" || newPassword === ""} />
        </div>
      </Form>
    </>
  )
}

export default ChangePassword
