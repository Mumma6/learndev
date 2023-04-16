import React, { useState, ChangeEvent, FormEvent } from "react"
import { Box, Button, Container, TextField, Typography } from "@mui/material"
import SubmitButton from "../shared/SubmitButton"
import { toast } from "react-toastify"
import { FaArrowLeft } from "react-icons/fa"
import NextLink from "next/link"
import useRedirect from "../customHooks/useRedirect"
import { fetcherTE } from "../../lib/axiosFetcher"
import { pipe } from "fp-ts/function"
import * as TE from "fp-ts/TaskEither"
import { Status } from "../../types/status"

const ForgotPasswordToken = ({ valid, token }: { valid: boolean; token: any }) => {
  const [status, setStatus] = useState<Status>("idle")
  const [newPassword, setNewPassword] = useState("")

  const { activateTimer } = useRedirect("/login", 4)

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    pipe(
      fetcherTE("/api/user/password/reset", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        data: {
          token,
          password: newPassword,
        },
      }),
      TE.fold(
        (error) => {
          setStatus("error")
          toast.error(error)
          setNewPassword("")
          return TE.left(error)
        },
        (data) => {
          setStatus("success")
          setNewPassword("")
          activateTimer()
          toast.success("Your password has been updated successfully. Redirecting to login page", {
            autoClose: 4000,
          })
          return TE.right(data)
        }
      )
    )()
  }

  return (
    <>
      <Box
        component="main"
        sx={{
          alignItems: "center",
          display: "flex",
          flexGrow: 1,
          minHeight: "100%",
          marginTop: 20,
        }}
      >
        {!valid ? (
          <Container maxWidth="sm">
            <Typography color="textPrimary" variant="h4">
              Invalid link
            </Typography>
            <Typography color="textPrimary" variant="h5">
              This is an invalid link. Please close this window and try again
            </Typography>
            <NextLink href="/login" passHref>
              <Button component="a" startIcon={<FaArrowLeft />}>
                Return to login
              </Button>
            </NextLink>
          </Container>
        ) : (
          <Container maxWidth="sm">
            <form onSubmit={onSubmit}>
              <Box sx={{ my: 3 }}>
                <Typography color="textPrimary" variant="h4">
                  Reset password
                </Typography>
              </Box>
              <Box
                sx={{
                  pb: 1,
                  pt: 1,
                }}
              >
                <Typography align="center" color="textSecondary" variant="body1">
                  Enter a new password for your account
                </Typography>
              </Box>
              <TextField
                fullWidth
                label="Password"
                margin="normal"
                name="password"
                onChange={(event: ChangeEvent<HTMLInputElement>) => setNewPassword(event.target.value)}
                value={newPassword}
                type="password"
                variant="outlined"
              />
              <Box sx={{ py: 2 }}>
                <SubmitButton text="Submit" isLoading={status === "loading"} isDisabled={status === "error"} />
              </Box>
            </form>
          </Container>
        )}
      </Box>
    </>
  )
}

export default ForgotPasswordToken
