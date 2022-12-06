import { Avatar, Card, CardContent, Grid, Typography } from "@mui/material"
import React from "react"
import { BsCollection } from "react-icons/bs"

const TotalProjects = () => {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Grid container spacing={3} sx={{ justifyContent: "space-between" }}>
          <Grid item>
            <Typography color="textSecondary" gutterBottom variant="overline">
              TOTAL PROJECTS
            </Typography>
            <Typography color="textPrimary" variant="h4">
              10
            </Typography>
          </Grid>
          <Grid item>
            <Avatar
              sx={{
                backgroundColor: "info.main",
                height: 56,
                width: 56,
              }}
            >
              <BsCollection />
            </Avatar>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default TotalProjects
