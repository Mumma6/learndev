import React from "react"
import { IUser } from "../../types/user"
import { Box, Button, Container, Grid, Typography } from "@mui/material"
import TotalCourses from "./TotalCourses"
import LearningProgress from "./LearningProgress"
import CoursesByProvider from "./CoursesByProvider"
import TotalQuizzes from "./TotalQuizzes"
import TotalProjects from "./TotalProjects"
import { useCourses, useQuizResults } from "../../lib/hooks"
import LatestQuizResults from "./LatestQuizResults"

interface IProps {
  user: IUser
}

// döp om denna fil till Home.tsx och lägg under Overview
/*

display:
  - latest projects
  - latest quizzes
  - ...other stuff?

  Ska man kunna välja själv vilka grafer osv man vill se? Premium tjänst kanske?

*/

const Home = ({ user }: IProps) => {
  const { data } = useCourses()
  const { data: quizResultsData } = useQuizResults()
  const userQuizResult = quizResultsData?.payload?.filter((p) => p.user_id === user._id).filter((x) => x.approved)
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
              <TotalQuizzes amount={userQuizResult?.length || 0} />
            </Grid>
            <Grid item lg={6} md={6} xl={3} xs={12}>
              {!!data?.payload?.length && <CoursesByProvider courses={data?.payload} />}
            </Grid>
            <Grid item lg={6} md={6} xl={3} xs={12}>
              <LatestQuizResults />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  )
}

export default Home
