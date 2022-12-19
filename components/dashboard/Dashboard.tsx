import React from "react"
import { IUser } from "../../types/user"
import { Box, Button, Container, Grid, Typography } from "@mui/material"
import TotalCourses from "../overview/TotalCourses"
import LearningProgress from "../overview/LearningProgress"
import CoursesByProvider from "../overview/CoursesByProvider"
import TotalQuizzes from "../overview/TotalQuizzes"
import TotalProjects from "../overview/TotalProjects"
import { useCourses } from "../../lib/hooks"

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
  const { data } = useCourses()
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
          <Box>
            <Typography color="textPrimary" variant="h4">
              Welcome {user.name}
            </Typography>
          </Box>

          <Grid container spacing={3}>
            <Grid item lg={3} sm={6} xl={3} xs={12}>
              <TotalCourses amount={data?.payload?.length || 0} />
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
            <Grid item lg={6} md={6} xl={3} xs={12}>
              {data?.payload && <CoursesByProvider courses={data?.payload} />}
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  )
}

export default Dashboard
