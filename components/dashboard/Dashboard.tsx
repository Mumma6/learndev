import React from "react"
import { IUser } from "../../types/user"
import { Box, Button, Container, Grid, Typography } from "@mui/material"
import TotalCourses from "../overview/TotalCourses"
import LearningProgress from "../overview/LearningProgress"
import CoursesByProvider from "../overview/CoursesByProvider"
import TotalQuizzes from "../overview/TotalQuizzes"
import TotalProjects from "../overview/TotalProjects"

interface IProps {
  user: IUser
}

/*

display:
  - latest projects
  - latest quizzes
  - ...other stuff?

*/

const Dashboard = ({ user }: IProps) => {
  console.log(user)
  return (
    <>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth={false}>
          <Grid container spacing={3}>
            <Grid item lg={3} sm={6} xl={3} xs={12}>
              <TotalCourses />
            </Grid>
            <Grid item lg={3} sm={6} xl={3} xs={12}>
              <TotalProjects />
            </Grid>
            <Grid item xl={3} lg={3} sm={6} xs={12}>
              <LearningProgress />
            </Grid>
            <Grid item xl={3} lg={3} sm={6} xs={12}>
              <TotalQuizzes />
            </Grid>
            <Grid item lg={4} md={6} xl={3} xs={12}>
              <CoursesByProvider />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  )
}

export default Dashboard
