import React from "react"
import { Box, Button, ButtonGroup, Card, CardContent, Container, Grid, Typography } from "@mui/material"
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

Create a "tasks module" just like courses and projects.

Use Notifications. Like when you complete or miss a goal


Create goals. Custom timeframe
Goals should be on the user object.

Number of tasks to complete
Courses to complete
Projects to complete

Quizzes to complete


Ska man kunna lägga till grafer till sin publica profile? "Add to public profile" knapp på varje graf?


Lägg till default text på grafer som behöver. tex om det inte finns några events eller kurser osv.


*/

const Home = ({ user }: IProps) => {
  const { data } = useCourses()
  const { data: projectsData } = useProjects()
  const { data: quizResultsData } = useQuizResults()

  // the results are sorted on the backend
  const userQuizResult = quizResultsData?.payload
    ?.filter((p) => p.user_id === user._id)

    .slice(0, 5)

  const approvedQuizzes = quizResultsData?.payload?.filter((p) => p.user_id === user._id).filter((x) => x.approved).length

  const montlyProgress = 70 // should come from goals. Ex, if the uses should to 10 courses in 7 days. When the user have done 7, show 70%

  // hide graphs should change the user settings object

  return (
    <>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
          marginTop: 1,
        }}
      >
        <Box mb={3}>
          <Box sx={{ mt: 3 }}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <ButtonGroup disabled size="large" variant="contained" aria-label="outlined primary button group">
                    <Button>Set goal</Button>
                    <Button>Create task</Button>
                    <Button>Hide graphs</Button>
                  </ButtonGroup>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>
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
              <LearningProgress number={montlyProgress} />
            </Grid>
            <Grid item xl={3} lg={3} sm={6} xs={12}>
              <TotalQuizzes amount={approvedQuizzes || 0} />
            </Grid>
            <Grid item lg={6} md={6} xl={3} xs={12}>
              <CoursesByProvider courses={data?.payload} />
            </Grid>
            <Grid item lg={6} md={6} xl={3} xs={12}>
              <LatestQuizResults quizResults={userQuizResult || []} />
            </Grid>
            <Grid item lg={6} md={6} xl={3} xs={12}>
              <UserSkillProfile />
            </Grid>
            <Grid item lg={6} md={6} xl={3} xs={12}>
              <UpcomingEvents />
            </Grid>
            <Grid item lg={6} md={6} xl={3} xs={12}>
              <TopicsChart />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  )
}

export default Home
