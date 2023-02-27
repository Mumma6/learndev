import React from "react"
import { IQuiz } from "../../../models/Quiz"
import { IQuizResult } from "../../../models/QuizResult"
import { CourseModelSchemaType } from "../../../schema/CourseSchema"
import { ProjectModelType } from "../../../schema/ProjectSchema"
import { UserModelSchemaType } from "../../../schema/UserSchema"
import {
  Button,
  Container,
  Grid,
  Typography,
  Box,
  Paper,
  Card,
  CardHeader,
  Divider,
  Chip,
  CardContent,
  Badge,
  IconButton,
} from "@mui/material"
import WorkCard from "./WorkCard"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import { FiCode, FiExternalLink } from "react-icons/fi"
import Link from "next/link"
import { CgWebsite } from "react-icons/cg"
import { FaBlog, FaGithub, FaLinkedin, FaTwitter, FaYoutube } from "react-icons/fa"

// https://www.npmjs.com/package/react-to-pdf

/*


tabel med kurser
tabel med projects
tabel med quiz results

knappar till socials


*/

interface IProps {
  user: UserModelSchemaType
  courses: CourseModelSchemaType[]
  projects: ProjectModelType[]
  quizResults: IQuizResult[]
  quizzes: IQuiz[]
}

const PublicProfile = ({ user, courses, projects, quizResults, quizzes }: IProps) => {
  console.log("user")
  console.log(user)

  console.log("courses")
  console.log(courses)

  console.log("projects")
  console.log(projects)

  console.log("quizResults")
  console.log(quizResults)

  console.log("quizzes")
  console.log(quizzes)

  return (
    <div style={{ backgroundColor: "#EDEADE", paddingTop: 50, paddingBottom: 50 }}>
      <Container>
        <Typography color="textPrimary" variant="h4">
          Studify profile
        </Typography>

        <Card
          sx={{
            marginTop: 5,
            marginBottom: 5,
          }}
        >
          <CardHeader
            sx={{
              paddingBottom: 2,
            }}
            subheader="About"
            title={user.name}
          />
          <Divider />
          <Paper sx={{ paddingTop: 2, paddingBottom: 1 }}>
            <Grid padding={2} container spacing={2}>
              <Grid xs={12} sm={6} md={6} item>
                {user.about}
              </Grid>
              <Grid xs={12} sm={6} md={6} item>
                {user.goals}
              </Grid>
            </Grid>
          </Paper>
        </Card>

        <Card>
          <CardHeader title="Skills" />
          <Divider />

          <Box p={3}>
            {user.skills.map((data) => (
              <Chip key={data.label} color="primary" style={{ margin: 4 }} label={data.label} />
            ))}
          </Box>

          <Divider />
        </Card>

        <Card
          sx={{
            marginBottom: 2,
            marginTop: 4,
          }}
        >
          <CardHeader
            sx={{
              paddingBottom: 2,
            }}
            subheader="Information about the person"
            title="Work experience"
          />
          <Divider />
          <Box pt={1} pb={2} px={2}>
            <Box component="ul" display="flex" flexDirection="column" p={0} m={0}>
              {user.workexperience.map((work, index) => (
                <WorkCard key={index} work={work} />
              ))}
            </Box>
          </Box>
        </Card>

        <Card sx={{ height: "100%", marginTop: 5 }}>
          <CardHeader title="Courses" />
          <Divider />
          <CardContent>
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Course name</TableCell>
                    <TableCell>Institution</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Link</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {courses.map((course) => (
                    <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                      <TableCell component="th" scope="row">
                        <Typography>{course.content.title}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography>{course.content.institution}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={course.completed ? "Completed" : "In progess"}
                          color={course.completed ? "success" : "info"}
                        />
                      </TableCell>
                      <TableCell>
                        {course.content.url && (
                          <Link style={{ textDecoration: "none" }} href={course.content.url} target="_blank" passHref>
                            <IconButton>
                              <FiExternalLink />
                            </IconButton>
                          </Link>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        <Card sx={{ height: "100%", marginTop: 5 }}>
          <CardHeader title="Projects" />
          <Divider />
          <CardContent>
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Project name</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Source</TableCell>
                    <TableCell>Live</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {projects.map((project) => (
                    <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                      <TableCell component="th" scope="row">
                        <Typography>{project.title}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={project.completed ? "Completed" : "In progess"}
                          color={project.completed ? "success" : "info"}
                        />
                      </TableCell>
                      <TableCell>
                        {project.sourceCodeUrl && (
                          <Link style={{ textDecoration: "none" }} href={project.sourceCodeUrl} target="_blank" passHref>
                            <IconButton disabled={!project.sourceCodeUrl}>
                              <FiCode />
                            </IconButton>
                          </Link>
                        )}
                      </TableCell>
                      <TableCell>
                        {project.deployedUrl && (
                          <Link style={{ textDecoration: "none" }} href={project.deployedUrl} target="_blank" passHref>
                            <IconButton disabled={!project.deployedUrl}>
                              <CgWebsite />
                            </IconButton>
                          </Link>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        <Card sx={{ height: "100%", marginTop: 5 }}>
          <CardHeader title="Socials" />
          <Divider />
          <CardContent>
            <Grid sx={{ margin: 2 }} container spacing={5}>
              {user.socials.github && (
                <Box>
                  <Link style={{ textDecoration: "none" }} href={user.socials.github} target="_blank" passHref>
                    <IconButton>
                      <FaGithub />
                    </IconButton>
                  </Link>
                </Box>
              )}
              {user.socials.linkedin && (
                <Box>
                  <Link style={{ textDecoration: "none" }} href={user.socials.linkedin} target="_blank" passHref>
                    <IconButton>
                      <FaLinkedin style={{ color: "#0072b1" }} />
                    </IconButton>
                  </Link>
                </Box>
              )}
              {user.socials.twitter && (
                <Box>
                  <Link style={{ textDecoration: "none" }} href={user.socials.twitter} target="_blank" passHref>
                    <IconButton>
                      <FaTwitter style={{ color: "#00acee" }} />
                    </IconButton>
                  </Link>
                </Box>
              )}
              {user.socials.youtube && (
                <Box>
                  <Link style={{ textDecoration: "none" }} href={user.socials.youtube} target="_blank" passHref>
                    <IconButton>
                      <FaYoutube style={{ color: "#FF0000" }} />
                    </IconButton>
                  </Link>
                </Box>
              )}
              {user.socials.personalWebsite && (
                <Box>
                  <Link style={{ textDecoration: "none" }} href={user.socials.personalWebsite} target="_blank" passHref>
                    <IconButton>
                      <CgWebsite />
                    </IconButton>
                  </Link>
                </Box>
              )}
              {user.socials.blog && (
                <Box>
                  <Link style={{ textDecoration: "none" }} href={user.socials.blog} target="_blank" passHref>
                    <IconButton>
                      <FaBlog />
                    </IconButton>
                  </Link>
                </Box>
              )}
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </div>
  )
}

export default PublicProfile
