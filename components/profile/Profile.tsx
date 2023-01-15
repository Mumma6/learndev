import React from "react"
import { useCurrentUser } from "../../lib/hooks"
import AboutYou from "./AboutYou"
import { Box, Container, Typography } from "@mui/material"
import Skills from "./Skills"
import Workexperience from "./Workexperience"
import Socials from "./Socials"

const Profile = () => {
  const { data, mutate } = useCurrentUser()
  return (
    <>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Typography sx={{ mb: 3 }} variant="h4">
            Profile
          </Typography>
          <AboutYou user={data?.payload!} mutate={mutate} />
          <Box sx={{ pt: 3 }}>
            <Skills />
          </Box>
          <Box sx={{ pt: 3 }}>
            <Workexperience />
          </Box>
          <Box sx={{ pt: 3 }}>
            <Socials />
          </Box>
        </Container>
      </Box>
    </>
  )
}

export default Profile
