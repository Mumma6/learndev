import React from "react"
import { useCurrentUser } from "../../lib/hooks"
import AboutYou from "./AboutYou"
import { Box, Container, Typography } from "@mui/material"
import Skills from "./Skills"
import Workexperience from "./Workexperience"
import Socials from "./Socials"

const Profile = () => {
  return (
    <>
      <Box
        component="main"
        sx={{
          marginTop: 5,
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth={false}>
          <AboutYou />
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
