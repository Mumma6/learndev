import React, { useState } from "react"
import { Box, Container, Grid, Pagination, Card, CardContent, Typography, Divider, CardHeader } from "@mui/material"
import { toast } from "react-toastify"
import { ClickEvent } from "../../types/generics"
import { fetcher1 } from "../../lib/axiosFetcher"
import { Skill } from "../../constants/skillsData"
import { useProjects } from "../../lib/hooks"
import { useSWRConfig } from "swr"
import ProjectsToolbar from "./ProjectsToolbar"
import ProjectCard from "./ProjectCard"
import AddProjectModal from "./AddProjectModal"
import { ProjectModelFormInputSchema, ProjectModelFromInputType } from "../../schema/ProjectSchema"
import { useZodFormValidation } from "../customHooks/useZodFormValidation"

export const initialProjectsFormData: Omit<ProjectModelFromInputType, "techStack" | "completed"> = {
  title: "",
  description: "",
  sourceCodeUrl: "",
  deployedUrl: "",
}

export const Projects = () => {
  const [open, setOpen] = useState(false)

  const [topicData, setTopicData] = useState<Skill[]>([])
  const [completed, setCompleted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { data } = useProjects()
  const { mutate } = useSWRConfig()

  const zodForm = useZodFormValidation<Omit<ProjectModelFromInputType, "techStack" | "completed">>(
    ProjectModelFormInputSchema.omit({ techStack: true, completed: true }),
    initialProjectsFormData
  )

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    zodForm.setValues(initialProjectsFormData)
    setTopicData([])
    setCompleted(false)
    zodForm.reset()
    setOpen(false)
  }

  const onAddProject = async (event: ClickEvent) => {
    event.preventDefault()
    try {
      setIsLoading(true)

      const response = await fetcher1<undefined, ProjectModelFromInputType>("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: {
          ...zodForm.values,
          techStack: topicData,
          completed,
        },
      })

      console.log(response)

      if (response?.error) {
        toast.error(response.error)
      } else {
        mutate("/api/projects")
        toast.success(response?.message)
      }
    } catch (e: any) {
      console.log(e)
    } finally {
      zodForm.setValues(initialProjectsFormData)
      setTopicData([])
      setIsLoading(false)
      handleClose()
    }
  }

  const deleteProject = async (id: string) => {
    const response = await fetcher1(`/api/projects?id=${id}`, {
      method: "DELETE",
    })

    if (response?.error) {
      toast.error(response.error)
    } else {
      mutate("/api/projects")
      toast.success(response?.message)
    }
  }

  return (
    <>
      <Box
        component="main"
        sx={{
          paddingTop: 10,
          paddingBottom: 18,
        }}
      >
        <AddProjectModal
          open={open}
          handleClose={handleClose}
          onAddProject={onAddProject}
          setCompleted={setCompleted}
          setTopicData={setTopicData}
          topicData={topicData}
          completed={completed}
          zodForm={zodForm}
        />
        <Container maxWidth={false}>
          <ProjectsToolbar handleClickOpen={handleClickOpen} />
          <Box sx={{ pt: 3 }}>
            <Box sx={{ mt: 1, mb: 1 }}>
              <Card>
                <CardHeader subheader="Projects in progress" title="Projects" />
                <Divider />
                <CardContent>
                  <Grid mb={4} mt={2} container spacing={2}>
                    {!isLoading &&
                      data?.payload
                        ?.filter((c) => !c.completed)
                        .map((project) => (
                          <Grid item key={project._id?.toString()} xl={3} lg={4} md={4} sm={6} xs={12}>
                            <ProjectCard deleteProject={deleteProject} project={project} />
                          </Grid>
                        ))}
                  </Grid>
                </CardContent>
              </Card>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              pt: 3,
            }}
          ></Box>
        </Container>
        <Container maxWidth={false}>
          <Box sx={{ pt: 1 }}>
            <Box sx={{ mt: 3, mb: 3 }}>
              <Card>
                <CardHeader subheader="Completed Projects" title="Projects" />
                <Divider />
                <CardContent style={{ padding: 13 }}>
                  <Grid mb={4} mt={2} container spacing={2}>
                    {!isLoading &&
                      data?.payload
                        ?.filter((c) => c.completed)
                        .map((project) => (
                          <Grid item key={project._id?.toString()} xl={3} lg={4} md={4} sm={6} xs={12}>
                            <ProjectCard deleteProject={deleteProject} project={project} />
                          </Grid>
                        ))}
                  </Grid>
                </CardContent>
              </Card>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              pt: 3,
            }}
          ></Box>
        </Container>
      </Box>
    </>
  )
}
