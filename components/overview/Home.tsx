import React from "react"
import { Box, Button, Container, Grid, Typography } from "@mui/material"
import TotalCourses from "./TotalCourses"
import LearningProgress from "./LearningProgress"
import CoursesByProvider from "./CoursesByProvider"
import TotalQuizzes from "./TotalQuizzes"
import TotalProjects from "./TotalProjects"
import { useCourses, useProjects, useQuizResults } from "../../lib/hooks"
import LatestQuizResults from "./LatestQuizResults"
import UserSkillProfile from "./UserSkillProfile"
import { UserModelSchemaType } from "../../schema/UserSchema"
import UpcomingEvents from "./UpcomingEvents"
import TopicsChart from "./TopicsChart"

interface IProps {
  user: UserModelSchemaType
}

/*

  Topics overview. What techs do i use the most


  Ska man kunna välja själv vilka grafer osv man vill se? Premium tjänst kanske?

*/

const Home = ({ user }: IProps) => {
  const { data } = useCourses()
  const { data: projectsData } = useProjects()
  const { data: quizResultsData } = useQuizResults()
  const userQuizResult = quizResultsData?.payload?.filter((p) => p.user_id === user._id).filter((x) => x.approved)
  return (
    <>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
          marginTop: 5,
        }}
      >
        <Container maxWidth={false}>
          <Grid container spacing={3}>
            <Grid item lg={3} sm={6} xl={3} xs={12}>
              <TotalCourses
                completedAmount={data?.payload?.filter((c) => c.completed).length || 0}
                inProgressAmount={data?.payload?.filter((c) => !c.completed).length || 0}
              />
            </Grid>
            <Grid item lg={3} sm={6} xl={3} xs={12}>
              <TotalProjects
                completedAmount={projectsData?.payload?.filter((c) => c.completed).length || 0}
                inProgressAmount={projectsData?.payload?.filter((c) => !c.completed).length || 0}
              />
            </Grid>
            <Grid item xl={3} lg={3} sm={6} xs={12}>
              <LearningProgress />
            </Grid>
            <Grid item xl={3} lg={3} sm={6} xs={12}>
              <TotalQuizzes amount={userQuizResult?.length || 0} />
            </Grid>
            <Grid item lg={6} md={6} xl={3} xs={12}>
              <CoursesByProvider courses={data?.payload} />
            </Grid>
            <Grid item lg={6} md={6} xl={3} xs={12}>
              <LatestQuizResults />
            </Grid>
            <Grid item lg={6} md={6} xl={3} xs={12}>
              <UserSkillProfile />
            </Grid>
            <Grid item lg={6} md={6} xl={3} xs={12}>
              <UpcomingEvents />
            </Grid>
            <Grid item lg={6} md={6} xl={6} xs={6}>
              <TopicsChart />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  )
}

export default Home
