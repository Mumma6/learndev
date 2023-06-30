import React from "react"
import { Box, Card, CardContent, CardHeader, Container, Divider } from "@mui/material"

const StudyRooms = () => {
  return (
    <Box
      component="main"
      sx={{
        paddingTop: 10
      }}
    >
      <Container maxWidth={false}>
        <Box sx={{ pt: 3 }}>
          <Box sx={{ mt: 1, mb: 1 }}>
            <Card>
              <CardHeader subheader="Connect with other students" title="Study rooms" />
              <Divider />
              <CardContent>
                <h1>Coming soon</h1>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default StudyRooms
