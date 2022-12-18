import React from "react"
import { Avatar, Box, Card, CardContent, Grid, LinearProgress, Typography } from "@mui/material"
import { FaChartBar } from "react-icons/fa"

const LearningProgress = () => {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Grid container spacing={3} sx={{ justifyContent: "space-between" }}>
          <Grid item>
            <Typography color="textSecondary" gutterBottom variant="overline">
              MONTHLY PROGRESS
            </Typography>
            <Typography color="textPrimary" variant="h4">
              75.5%
            </Typography>
          </Grid>
          <Grid item>
            <Avatar
              sx={{
                backgroundColor: "warning.main",
                height: 56,
                width: 56,
              }}
            >
              <FaChartBar />
            </Avatar>
          </Grid>
        </Grid>
        <Box sx={{ pt: 3 }}>
          <LinearProgress value={75.5} variant="determinate" />
        </Box>
      </CardContent>
    </Card>
  )
}

export default LearningProgress