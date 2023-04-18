import React from "react"
import { Box, Button, ButtonGroup, Card, CardContent, Container, Grid, Typography } from "@mui/material"
import TotalCourses from "./TotalCourses"
import LearningProgress from "./LearningProgress"
import CoursesByProvider from "./CoursesByProvider"
import TotalQuizzes from "./TotalQuizzes"
import TotalProjects from "./TotalProjects"
import { useCourses, useProjects, useQuizResults, useTasks } from "../../lib/hooks"
import LatestQuizResults from "./LatestQuizResults"
import UserSkillProfile from "./UserSkillProfile"
import { UserModelSchemaType } from "../../schema/UserSchema"
import UpcomingEvents from "./UpcomingEvents"
import TopicsChart from "./TopicsChart"
import { pipe } from "fp-ts/function"
import * as A from "fp-ts/Array"

import * as O from "fp-ts/Option"
import { IQuizResult } from "../../models/QuizResult"
import { getOArraySize } from "../../helpers/helpers"
import TotalTasks from "./TotalTasks"

interface IProps {
  user: UserModelSchemaType
}

/*

Byt till samma ikoner som sidebaren

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

Istället för approved quizzes. Visa hur många tasks man har, completed/inprogress


*/

const Home = ({ user }: IProps) => {
  const { data } = useCourses()
  const { data: projectsData } = useProjects()
  const { data: quizResultsData } = useQuizResults()
  const { data: tasksData } = useTasks()

  // the results are sorted on the backend
  const userQuizResult = pipe(
    O.fromNullable(quizResultsData),
    O.chain((data) => O.fromNullable(data.payload)),
    O.map(A.filter((p) => p.user_id === user._id)),
    O.map(A.takeLeft(5)),
    O.getOrElse<Array<IQuizResult>>(() => [])
  )

  const numberOfApprovedQuizzes = pipe(
    O.fromNullable(quizResultsData),
    O.chain((data) => O.fromNullable(data.payload)),
    O.map(A.filter((p) => p.user_id === user._id)),
    O.map(A.filter((p) => p.approved)),
    getOArraySize
  )

  // the goal can consists of tasks, events, quizzes and so on...
  const montlyProgress = 70 // should come from goals. Ex, if the uses should to 10 courses in 7 days. When the user have done 7, show 70%

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
                completedAmount={pipe(
                  O.fromNullable(data?.payload),
                  O.map(A.filter((d) => d.content.status === "Done")),
                  getOArraySize
                )}
                inProgressAmount={pipe(
                  O.fromNullable(data?.payload),
                  O.map(A.filter((d) => d.content.status === "In progress")),
                  getOArraySize
                )}
                wishlistAmount={pipe(
                  O.fromNullable(data?.payload),
                  O.map(A.filter((d) => d.content.status === "Wishlist")),
                  getOArraySize
                )}
              />
            </Grid>
            <Grid item lg={3} sm={6} xl={3} xs={12}>
              <TotalProjects
                completedAmount={pipe(
                  O.fromNullable(projectsData?.payload),
                  O.map(A.filter((d) => d.status === "Done")),
                  getOArraySize
                )}
                inProgressAmount={pipe(
                  O.fromNullable(projectsData?.payload),
                  O.map(A.filter((d) => d.status === "In progress")),
                  getOArraySize
                )}
                planningAmount={pipe(
                  O.fromNullable(projectsData?.payload),
                  O.map(A.filter((d) => d.status === "Planning")),
                  getOArraySize
                )}
              />
            </Grid>

            <Grid item xl={3} lg={3} sm={6} xs={12}>
              <TotalTasks
                completed={pipe(O.fromNullable(tasksData?.payload), O.map(A.filter((d) => d.completed)), getOArraySize)}
                inProgress={pipe(O.fromNullable(tasksData?.payload), O.map(A.filter((d) => !d.completed)), getOArraySize)}
              />
            </Grid>
            <Grid item xl={3} lg={3} sm={6} xs={12}>
              <LearningProgress number={montlyProgress} />
            </Grid>
            <Grid item lg={6} md={6} xl={3} xs={12}>
              <CoursesByProvider courses={data?.payload} />
            </Grid>

            <Grid item lg={6} md={6} xl={3} xs={12}>
              <LatestQuizResults quizResults={userQuizResult} />
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
