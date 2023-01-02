import { useRouter } from "next/router"
import React, { useEffect } from "react"
import { useCurrentUser } from "../../lib/hooks"
import Head from "next/head"
import { IUser } from "../../types/user"
import EmailVerify from "../auth/EmailVerify"
import AboutYou from "../profile/AboutYou"
import ChangePassword from "./ChangePassword"
import { Box, Container, Typography } from "@mui/material"
import DeleteAccount from "./DeleteAccount"

const Settings = () => {
  const { data, mutate } = useCurrentUser()

  return (
    <>
      <Head>
        <title>{`Settings | ${data?.payload?.name}`}</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Typography sx={{ mb: 3 }} variant="h4">
            Settings
          </Typography>
          <EmailVerify user={data?.payload!} />

          <Box sx={{ pt: 3 }}>
            <ChangePassword />
          </Box>
          <Box sx={{ pt: 3 }}>
            <DeleteAccount />
          </Box>
        </Container>
      </Box>
    </>
  )
}

export default Settings
