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
import { FiCode, FiExternalLink } from "react-icons/fi"
import Link from "next/link"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import NextLink from "next/link"
import { FaArrowLeft, FaArrowRight, FaCheck, FaPen, FaTrash } from "react-icons/fa"
import { CourseModelSchemaType } from "../../schema/CourseSchema"
import EditCourseModal from "./EditCourseModal"
import ClearIcon from "@mui/icons-material/Clear"

import { useSWRConfig } from "swr"
import { pipe } from "fp-ts/function"
import * as A from "fp-ts/Array"
import * as O from "fp-ts/Option"
import * as TE from "fp-ts/TaskEither"
import { fetcherTE } from "../../lib/axiosFetcher"
import { toast } from "react-toastify"
import { TaskModelType } from "../../schema/TaskSchema"
import { useTasks } from "../../lib/hooks"

/*

Do tha same for projects

*/

interface IProps {
  course: CourseModelSchemaType
}

const resurs = [
  {
    title: "Vue docs",
    type: "Documentation",
    link: "/",
  },
  {
    title: "Vue intro book",
    type: "Book",
    link: "",
  },
  {
    title: "Vue Best Practice",
    type: "Articel",
    link: "/",
  },
]

const Course = ({ course }: IProps) => {
  const [open, setOpen] = useState(false)

  const { mutate } = useSWRConfig()

  const { data } = useTasks()

  const dataToShow = pipe(
    data?.payload,
    O.fromNullable,
    O.map(A.filter((p) => p.activityId === course._id)),
    O.fold(
      () => [],
      (d) => d
    )
  )

  const toggleTask = async (_id: string, completed: boolean) => {
    pipe(
      fetcherTE<TaskModelType, Partial<TaskModelType>>("/api/tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        data: {
          _id,
          completed,
        },
      }),
      TE.fold(
        (error) => {
          toast.error(error)
          return TE.left(error)
        },
        (response) => {
          mutate("/api/tasks")
          return TE.right(response)
        }
      )
    )()
  }

  const onClickToggle = (completed: boolean, id: string) => {
    toggleTask(id, !completed)
  }

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
              <Card>
                <CardHeader title="Tasks" />
                <TableContainer component={Paper}>
                  <Table aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Mark as done</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {dataToShow.map((task) => (
                        <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                          <TableCell component="th" scope="row">
                            <Typography>{task.title}</Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={task.completed ? "Completed" : "In progess"}
                              color={task.completed ? "success" : "info"}
                            />
                          </TableCell>
                          <TableCell>
                            <IconButton
                              onClick={() => onClickToggle(task.completed, task._id)}
                              color={task.completed ? "info" : "success"}
                              size="small"
                            >
                              {task.completed ? <ClearIcon /> : <FaCheck />}
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Card>
            </Grid>
            <Grid item sm={6}>
              <Card>
                <CardHeader title="Resources" />
                <TableContainer component={Paper}>
                  <Table aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Link</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {resurs.map((r) => (
                        <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                          <TableCell component="th" scope="row">
                            <Typography>{r.title}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography>{r.type}</Typography>
                          </TableCell>
                          <TableCell>
                            <Link style={{ textDecoration: "none" }} href={r.link} target="_blank" passHref>
                              <IconButton color="primary" disabled={!r.link}>
                                <FiExternalLink />
                              </IconButton>
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  )
}

export default Course
