import React, { useState, ChangeEvent, FormEvent } from "react"

import SubmitButton from "../shared/SubmitButton"
import { toast } from "react-toastify"
import useRedirect from "../customHooks/useRedirect"
import { Status } from "../../types/status"
import { FaArrowLeft } from "react-icons/fa"
import NextLink from "next/link"
import { Box, Button, Container, TextField, Typography } from "@mui/material"
import { fetcher } from "../../lib/axiosFetcher"

const ForgotPassword = () => {
  const [status, setStatus] = useState<Status>("idle")
  const [email, setEmail] = useState("")

  const { activateTimer } = useRedirect("/login", 4)

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      setStatus("loading")
      const response = await fetcher("/api/user/password/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: email,
      })
      console.log(response)
      if (response.error) {
        setStatus("error")
        toast.error(response.error)
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
      <Container maxWidth="sm">
        <NextLink href="/login" passHref>
          <Button component="a" startIcon={<FaArrowLeft />}>
            Sign in
          </Button>
        </NextLink>
        <form onSubmit={onSubmit}>
          <Box sx={{ my: 3 }}>
            <Typography color="textPrimary" variant="h4">
              Forgot password
            </Typography>
          </Box>
          <Box
            sx={{
              pb: 1,
              pt: 1,
            }}
          >
            <Typography align="center" color="textSecondary" variant="body1">
              Enter your email
            </Typography>
          </Box>
          <TextField
            fullWidth
            label="Email"
            margin="normal"
            name="email"
            onChange={(event: ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)}
            value={email}
            type="text"
            variant="outlined"
          />
          <Box sx={{ py: 2 }}>
            <SubmitButton text="Reset" isLoading={status === "loading"} isDisabled={status === "error"} />
          </Box>
        </form>
      </Container>
    </Box>
  )
}

export default ForgotPassword
