import React, { useEffect } from "react"
import { toast } from "react-toastify"
import useRedirect from "../customHooks/useRedirect"
import { Box, Button, Container, Grid, Link, TextField, Typography } from "@mui/material"
import { FaArrowLeft } from "react-icons/fa"
import NextLink from "next/link"

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
        {!valid ? (
          <>
            <Typography color="textPrimary" variant="h4">
              Invalid link
            </Typography>
            <Typography color="textPrimary" variant="h5">
              This is an invalid link. Please close this window and try again
            </Typography>
            <NextLink href="/settings" passHref>
              <Button component="a" startIcon={<FaArrowLeft />}>
                Return to settings
              </Button>
            </NextLink>
          </>
        ) : (
          <>
            <Typography color="textPrimary" variant="h4">
              Thank you for verifying your email. You may close this page
            </Typography>
            <NextLink href="/settings" passHref>
              <Button component="a" startIcon={<FaArrowLeft />}>
                Return to settings
              </Button>
            </NextLink>
          </>
        )}
      </Container>
    </Box>
  )
}

export default EmailVerifyToken
