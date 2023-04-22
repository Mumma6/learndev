import React from "react"
import { Box, Container, Grid, Button, Card, CardContent, Typography, Divider, CardHeader } from "@mui/material"
import ResourcesDataGrid from "./ResourcesDataGrid"
import CardHeaderTitle from "../shared/CardHeaderTitle"

const Resources = () => {
  const handleClickOpen = () => console.log("hej")
  return (
    <Box
      component="main"
      sx={{
        paddingTop: 10,
      }}
    >
      <Container maxWidth={false}>
        <Box sx={{ pt: 3 }}>
          <Box sx={{ mt: 1, mb: 1 }}>
            <Card>
              <CardHeader
                subheader="Resources for your courses and projects."
                title={
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <CardHeaderTitle title="Resources" />
                    <div style={{ display: "flex" }}>
                      <Button sx={{ marginLeft: 1 }} color="primary" variant="contained" onClick={handleClickOpen}>
                        Add resource
                      </Button>
                    </div>
                  </div>
                }
              />
              <Divider />
              <CardContent>
                <ResourcesDataGrid />
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default Resources
