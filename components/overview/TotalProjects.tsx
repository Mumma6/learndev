import { Avatar, Box, Card, CardContent, Grid, Typography } from "@mui/material"
import React from "react"
import { BsCollection } from "react-icons/bs"

interface IProps {
  completedAmount: number
  inProgressAmount: number
  planningAmount: number
}

const TotalProjects = ({ completedAmount, inProgressAmount, planningAmount }: IProps) => {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Grid container spacing={3} sx={{ justifyContent: "space-between" }}>
          <Grid item>
            <Typography color="textSecondary" gutterBottom variant="overline">
              Projects
            </Typography>
            <Box mt={1}>
              <Typography sx={{ fontSize: 18 }} color="textPrimary" variant="overline">
                Completed: {completedAmount}
              </Typography>
            </Box>
            <Box>
              <Typography sx={{ fontSize: 18 }} color="textPrimary" variant="overline">
                In progress: {inProgressAmount}
              </Typography>
            </Box>
            <Box>
              <Typography sx={{ fontSize: 18 }} color="textPrimary" variant="overline">
                Planning: {inProgressAmount}
              </Typography>
            </Box>
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
