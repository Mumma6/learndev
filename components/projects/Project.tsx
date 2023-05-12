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
  Chip,
  Typography,
  Grid,
  IconButton,
} from "@mui/material"
import NextLink from "next/link"
import { FaArrowLeft, FaPen, FaPenAlt } from "react-icons/fa"
import { ProjectModelType, ProjectModelFromInputType } from "../../schema/ProjectSchema"
import EditProjectModal from "./EditProjectModal"
import { pipe } from "fp-ts/function"
import * as A from "fp-ts/Array"
import * as O from "fp-ts/Option"
import * as TE from "fp-ts/TaskEither"
import { useResources, useTasks } from "../../lib/hooks"
import SimpleTaskList from "../tasks/SimpleTaskList"
import { fetcherTE } from "../../lib/axiosFetcher"
import { TaskModelType } from "../../schema/TaskSchema"
import { toast } from "react-toastify"
import { useSWRConfig } from "swr"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import { getResourceTypeColor } from "../../helpers/helpers"
import { FiExternalLink } from "react-icons/fi"

interface IProps {
  project: ProjectModelType
}

/*

lägg till 2 listor under kortet med tasks och resources.

*/

const Project = ({ project }: IProps) => {
  const [open, setOpen] = useState(false)

  const handleClose = () => {
    setOpen(false)
  }

  const { mutate } = useSWRConfig()

  const { data: tasksData } = useTasks()
  const { data: resourceData } = useResources()

  const taskDataToShow = pipe(
    tasksData?.payload,
    O.fromNullable,
    O.map(A.filter((p) => p.activityId === project._id)),
    O.fold(
      () => [],
      (d) => d
    )
  )

  const resourceDataToShow = pipe(
    resourceData?.payload,
    O.fromNullable,
    O.map(A.filter((r) => project.resources.includes(r.title))),
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

  return (
    <Box
      component="main"
      sx={{
        marginTop: 15,
        paddingBottom: 43,
      }}
    >
      <EditProjectModal open={open} handleClose={handleClose} project={project} />
      <Container maxWidth="lg">
        <Card>
          <Box m={2}>
            <NextLink style={{ textDecoration: "none" }} href="/projects" passHref>
              <Button component="a" startIcon={<FaArrowLeft />}>
                Back
              </Button>
            </NextLink>
            <Button onClick={() => setOpen(true)} sx={{ float: "right" }} variant="contained" startIcon={<FaPen />}>
              Edit
            </Button>
          </Box>
          <CardHeader title={project.title} />
          <Box m={2}>
            {!!project.deployedUrl && (
              <NextLink style={{ textDecoration: "none" }} target="_blank" href={project.deployedUrl} passHref>
                <Button component="a">View demo</Button>
              </NextLink>
            )}
            {!!project.sourceCodeUrl && (
              <NextLink style={{ textDecoration: "none" }} target="_blank" href={project.sourceCodeUrl} passHref>
                <Button component="a">View source code</Button>
              </NextLink>
            )}
          </Box>
          <Divider />
          <CardContent>{project.description}</CardContent>
          <Divider />
          <Box sx={{ marginTop: 3 }}>
            <Typography sx={{ marginLeft: 2.5 }} color="textPrimary" variant="h6">
              Tech stack
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
              {project.techStack.map((data) => (
                <Chip key={data.label} color="primary" label={data.label} sx={{ marginRight: 1 }} />
              ))}
            </Box>
          </Box>
        </Card>
        <Box mt={2}>
          <Grid container spacing={2}>
            <Grid item sm={6}>
              <Card>
                <CardHeader
                  title="Tasks"
                  subheader={taskDataToShow.length ? "All tasks connected to this course" : "No tasks"}
                />
                <SimpleTaskList dataToShow={taskDataToShow} toggleTask={toggleTask} />
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
                      {resourceDataToShow.map((r) => (
                        <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                          <TableCell component="th" scope="row">
                            <Typography>{r.title}</Typography>
                          </TableCell>
                          <TableCell>
                            <Chip label={r.type} style={{ backgroundColor: getResourceTypeColor(r.type), color: "white" }} />
                          </TableCell>
                          <TableCell>
                            <NextLink style={{ textDecoration: "none" }} href={r.link} target="_blank" passHref>
                              <IconButton color="primary" disabled={!r.link}>
                                <FiExternalLink />
                              </IconButton>
                            </NextLink>
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

export default Project

/*
Visa bilder i framtiden
tags?

*/
