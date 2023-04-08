import { Avatar, Box, Card, CardContent, Grid, Typography } from "@mui/material"
import React from "react"
import { FaArrowUp } from "react-icons/fa"
import { MdSchool } from "react-icons/md"

interface IProps {
  completedAmount: number
  inProgressAmount: number
  wishlistAmount: number
}

// visa completed courses x och courses inprogress x
// två rader

const TotalCourses = ({ completedAmount, inProgressAmount, wishlistAmount }: IProps) => {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Grid container spacing={3} sx={{ justifyContent: "space-between" }}>
          <Grid item>
            <Typography color="textSecondary" gutterBottom variant="overline">
              COURSES
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
                Wishlist: {wishlistAmount}
              </Typography>
            </Box>
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
