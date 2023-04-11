import React, { useState } from "react"
import {
  Box,
  Paper,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Container,
  Button,
  Typography,
  Chip,
  IconButton,
  Grid,
} from "@mui/material"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import NextLink from "next/link"
import { FaArrowLeft, FaArrowRight, FaPen } from "react-icons/fa"
import { CourseModelSchemaType } from "../../schema/CourseSchema"
import EditCourseModal from "./EditCourseModal"
import Link from "next/link"
interface IProps {
  course: CourseModelSchemaType
}

// single course

/*



*/

const tasks = [
  {
    name: "Todo 1",
    completed: false,
  },
  {
    name: "Todo 2",
    completed: true,
  },
]
const Course = ({ course }: IProps) => {
  const [open, setOpen] = useState(false)

  const handleClose = () => {
    setOpen(false)
  }
  return (
    <Box
      component="main"
      sx={{
        marginTop: 15,
        paddingBottom: 40,
      }}
    >
      <EditCourseModal open={open} handleClose={handleClose} course={course} />
      <Container maxWidth="lg">
        <Card>
          <Box m={2}>
            <NextLink style={{ textDecoration: "none" }} href="/courses" passHref>
              <Button component="a" startIcon={<FaArrowLeft />}>
                Back
              </Button>
            </NextLink>
            <Button onClick={() => setOpen(true)} sx={{ float: "right" }} variant="contained" startIcon={<FaPen />}>
              Edit
            </Button>
          </Box>
          <CardHeader
            title={course.content.title}
            subheader={
              <>
                <p>{`Duration: ${course.content.duration} hours`}</p>
                <p>{`Provider: ${course.content.institution}`}</p>
              </>
            }
          />
          <Box m={2}>
            <NextLink style={{ textDecoration: "none" }} target="_blank" href={course.content.url} passHref>
              <Button component="a">Go to course</Button>
            </NextLink>
            {!!course.content.certificateUrl && (
              <NextLink style={{ textDecoration: "none" }} target="_blank" href={course.content.certificateUrl} passHref>
                <Button component="a">View certificate</Button>
              </NextLink>
            )}
          </Box>
          <Divider />
          <CardContent>
            <Box>{course.content.description}</Box>
          </CardContent>
          <Divider />
          <Box sx={{ marginTop: 3 }}>
            <Typography sx={{ marginLeft: 2.5 }} color="textPrimary" variant="h6">
              Topics
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "start",
                flexWrap: "wrap",
                listStyle: "none",
                p: 1.5,
                mt: 3,
              }}
              component="ul"
            >
              {course.topics.map((data) => (
                <Chip key={data.label} color="primary" label={data.label} sx={{ marginRight: 1 }} />
              ))}
            </Box>
          </Box>
        </Card>
        <Box mt={8}>
          <Grid container spacing={2}>
            <Grid item sm={6}>
              <TableContainer component={Paper}>
                <Table aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Task name</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Go to</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tasks.map((task) => (
                      <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                        <TableCell component="th" scope="row">
                          <Typography>{task.name}</Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={task.completed ? "Completed" : "In progess"}
                            color={task.completed ? "success" : "info"}
                          />
                        </TableCell>
                        <TableCell>
                          <Link style={{ textDecoration: "none" }} href={"/"} target="_blank" passHref>
                            <IconButton>
                              <FaArrowRight />
                            </IconButton>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            <Grid item>
              <p>Resurser</p>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  )
}

export default Course
