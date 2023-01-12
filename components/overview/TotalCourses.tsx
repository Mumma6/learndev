import { Avatar, Box, Card, CardContent, Grid, Typography } from "@mui/material"
import React from "react"
import { FaArrowUp } from "react-icons/fa"
import { MdSchool } from "react-icons/md"

interface IProps {
  amount: number
}

const TotalCourses = ({ amount }: IProps) => {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Grid container spacing={3} sx={{ justifyContent: "space-between" }}>
          <Grid item>
            <Typography color="textSecondary" gutterBottom variant="overline">
              COMPLETED COURSES
            </Typography>
            <Typography color="textPrimary" variant="h4">
              {amount}
            </Typography>
          </Grid>
          <Grid item>
            <Avatar
              sx={{
                backgroundColor: "success.main",
                height: 56,
                width: 56,
              }}
            >
              <MdSchool />
            </Avatar>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default TotalCourses
