import { Avatar, Card, CardContent, Grid, Typography } from "@mui/material"
import React from "react"
import { FaMicroscope } from "react-icons/fa"
import { useCurrentUser, useQuizResults } from "../../lib/hooks"

interface IProps {
  amount: number
}

const TotalQuizzes = ({ amount }: IProps) => {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Grid container spacing={3} sx={{ justifyContent: "space-between" }}>
          <Grid item>
            <Typography color="textSecondary" gutterBottom variant="overline">
              APPROVED QUIZZES
            </Typography>
            <Typography color="textPrimary" variant="h4">
              {amount}
            </Typography>
          </Grid>
          <Grid item>
            <Avatar
              sx={{
                backgroundColor: "primary.main",
                height: 56,
                width: 56,
              }}
            >
              <FaMicroscope />
            </Avatar>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default TotalQuizzes
