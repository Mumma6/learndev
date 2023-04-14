import React, { useState, useEffect } from "react"
import { Box, Container, Grid, Pagination, Card, CardContent, Typography, Divider, CardHeader } from "@mui/material"
import { toast } from "react-toastify"
import { ClickEvent } from "../../types/generics"
import { fetcher, fetcherTE } from "../../lib/axiosFetcher"
import { Skill } from "../../constants/skillsData"
import { useProjects } from "../../lib/hooks"
import { useSWRConfig } from "swr"
import ProjectsToolbar from "./ProjectsToolbar"
import ProjectCard from "./ProjectCard"
import Tabs from "@mui/material/Tabs"
import Tab from "@mui/material/Tab"
import { pipe } from "fp-ts/function"
import * as A from "fp-ts/Array"

import * as O from "fp-ts/Option"
import * as TE from "fp-ts/TaskEither"

import AddProjectModal from "./AddProjectModal"
import {
  ProjectModelFormInputSchema,
  ProjectModelFromInputType,
  ProjectModelType,
  ProjectStatusEnum,
  ProjectStatusEnumType,
} from "../../schema/ProjectSchema"
import { useZodFormValidation } from "../customHooks/useZodFormValidation"
import { StatusEnum } from "../../schema/CourseSchema"
import InfoTooltip from "../shared/Tooltip"
import { getOArraySize } from "../../helpers/helpers"

export const initialProjectsFormData: Omit<ProjectModelFromInputType, "techStack"> = {
  title: "",
  description: "",
  sourceCodeUrl: "",
  deployedUrl: "",
  status: ProjectStatusEnum.Enum["In progress"],
}

export const Projects = () => {
  const [open, setOpen] = useState(false)
  const [statusValue, setStatusValue] = useState<ProjectStatusEnumType>("In progress")
  const [topicData, setTopicData] = useState<Skill[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const [dataToShow, setDataToShow] = useState<ProjectModelType[]>([])

  const { data } = useProjects()
  const { mutate } = useSWRConfig()

  const zodForm = useZodFormValidation<Omit<ProjectModelFromInputType, "techStack">>(
    ProjectModelFormInputSchema.omit({ techStack: true }),
    initialProjectsFormData
  )

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    zodForm.setValues(initialProjectsFormData)
    setTopicData([])
    zodForm.reset()
    setOpen(false)
  }

  useEffect(() => {
    if (data?.payload) {
      return setDataToShow(data?.payload?.filter((c) => c.status === statusValue))
    }
  }, [statusValue, data])

  const resetForm = () => {
    zodForm.setValues(initialProjectsFormData)
    setIsLoading(false)
    setTopicData([])
    handleClose()
  }

  const getNumberOfStatuses = (status: ProjectStatusEnumType) =>
    pipe(O.fromNullable(data?.payload), O.map(A.filter((d) => d.status === status)), getOArraySize)

  const onAddProject = async () => {
    setIsLoading(true)
    pipe(
      fetcherTE<ProjectModelType, ProjectModelFromInputType>("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: {
          ...zodForm.values,
          techStack: topicData,
        },
      }),
      TE.fold(
        (error) => {
          toast.error(error)
          resetForm()
          return TE.left(error)
        },
        (data) => {
          toast.success(data.message)
          mutate("/api/projects")
          resetForm()
          return TE.right(data)
        }
      )
    )()
  }

  const deleteProject = async (id: string) => {
    pipe(
      fetcherTE(`/api/projects?id=${id}`, { method: "DELETE" }),
      TE.fold(
        (error) => {
          toast.error(error)
          return TE.left(error)
        },
        (response) => {
          mutate("/api/projects")
          toast.success(response?.message)
          return TE.right(response)
        }
      )
    )()
  }

  const handleChange = (_: React.SyntheticEvent, newValue: ProjectStatusEnumType) => {
    setStatusValue(newValue)
  }

  return (
    <>
      <Box
        component="main"
        sx={{
          paddingTop: 10,
        }}
      >
        <AddProjectModal
          open={open}
          handleClose={handleClose}
          onAddProject={onAddProject}
          setTopicData={setTopicData}
          topicData={topicData}
          zodForm={zodForm}
        />
        <Container maxWidth={false}>
          <ProjectsToolbar handleClickOpen={handleClickOpen} />

          <Card sx={{ marginTop: 4 }}>
            <CardHeader
              title={
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <Tabs value={statusValue} onChange={handleChange} aria-label="basic tabs example">
                    <Tab
                      label={`In progress (${getNumberOfStatuses("In progress")})`}
                      value={ProjectStatusEnum.Enum["In progress"]}
                    />
                    <Tab label={`Done (${getNumberOfStatuses("Done")})`} value={ProjectStatusEnum.Enum.Done} />
                    <Tab label={`Planning (${getNumberOfStatuses("Planning")})`} value={ProjectStatusEnum.Enum.Planning} />
                  </Tabs>
                  <InfoTooltip text="Keep track of all your projects here. Add projects you have completed, working on at this moment and projects you want plan to make in the future" />
                </div>
              }
            />
            <Divider />
            <CardContent>
              <Grid mb={4} mt={2} container spacing={2}>
                {!isLoading &&
                  dataToShow.map((project) => (
                    <Grid item key={project._id} xl={3} lg={3} md={3} sm={6} xs={12}>
                      <ProjectCard deleteProject={deleteProject} project={project} />
                    </Grid>
                  ))}
              </Grid>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </>
  )
}
