import { Avatar, Box, Card, CardContent, Grid, Typography } from "@mui/material"
import React from "react"
import { FaTasks } from "react-icons/fa"

interface IProps {
  completed: number
  inProgress: number
}

const TotalTasks = ({ completed, inProgress }: IProps) => {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Grid container spacing={3} sx={{ justifyContent: "space-between" }}>
          <Grid item>
            <Typography color="textSecondary" gutterBottom variant="overline">
              TASKS
            </Typography>
            <Box mt={1}>
              <Typography sx={{ fontSize: 18 }} color="textPrimary" variant="overline">
                Completed: {completed}
              </Typography>
            </Box>
            <Box>
              <Typography sx={{ fontSize: 18 }} color="textPrimary" variant="overline">
                In progress: {inProgress}
              </Typography>
            </Box>
          </Grid>
          <Grid item>
            <Avatar
              sx={{
                backgroundColor: "primary.main",
                height: 56,
                width: 56,
              }}
            >
              <FaTasks />
            </Avatar>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default TotalTasks
