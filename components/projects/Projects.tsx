import React, { useState } from "react"
import {
  Box,
  Container,
  Grid,
  Pagination,
  Card,
  CardContent,
  Typography,
  Divider,
  CardHeader,
} from "@mui/material"
import { toast } from "react-toastify"
import { ClickEvent } from "../../types/generics"
import { fetcher1 } from "../../lib/axiosFetcher"
import { Skill } from "../../constants/skillsData"
import { useProjects } from "../../lib/hooks"
import { useSWRConfig } from "swr"
import ProjectsToolbar from "./ProjectsToolbar"
import { IProjects } from "../../models/Projects"
import ProjectCard from "./ProjectCard"
import AddProjectModal from "./AddProjectModal"

export interface ProjectsFormData {
  title: string
  shortDescription: string
  sourceCodeUrl: string
  deployedUrl: string
  description: string
}

export const initialProjectsFormData: ProjectsFormData = {
  title: "",
  shortDescription: "",
  description: "",
  sourceCodeUrl: "",
  deployedUrl: "",
}

export const Projects = () => {
  const [open, setOpen] = useState(false)
  const [projectFormData, setProjectFormData] = useState<ProjectsFormData>(initialProjectsFormData)
  const [topicData, setTopicData] = useState<Skill[]>([])
  const [completed, setCompleted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { data } = useProjects()
  const { mutate } = useSWRConfig()

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const onAddProject = async (event: ClickEvent) => {
    event.preventDefault()
    try {
      setIsLoading(true)

      const response = await fetcher1<undefined, Partial<IProjects>>("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: {
          ...projectFormData,
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
      setProjectFormData(initialProjectsFormData)
      setTopicData([])
      setIsLoading(false)
      handleClose()
    }
  }

  const deleteProject = async (id: string) => {
    console.log("delete project", id)
  }

  return (
    <>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <AddProjectModal
          open={open}
          handleClose={handleClose}
          projectFormData={projectFormData}
          setProjectFormData={setProjectFormData}
          onAddProject={onAddProject}
          setCompleted={setCompleted}
          setTopicData={setTopicData}
          topicData={topicData}
          completed={completed}
        />
        <Container maxWidth={false}>
          <ProjectsToolbar handleClickOpen={handleClickOpen} />
          <Box sx={{ pt: 3 }}>
            <Box sx={{ mt: 3, mb: 3 }}>
              <Card>
                <CardHeader subheader="Projects in progress" title="Projects" />
                <Divider />
                <CardContent style={{ padding: 13 }}>
                  <Grid mb={4} mt={2} container spacing={2}>
                    {!isLoading &&
                      data?.payload
                        ?.filter((c) => !c.completed)
                        .map((project: IProjects) => (
                          <Grid item key={project._id?.toString()} lg={4} md={4} sm={4} xs={12}>
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
          >
            <Pagination color="primary" count={3} size="small" />
          </Box>
        </Container>
        <Container maxWidth={false}>
          <Box sx={{ pt: 3 }}>
            <Box sx={{ mt: 3, mb: 3 }}>
              <Card>
                <CardHeader subheader="Completed Projects" title="Projects" />
                <Divider />
                <CardContent style={{ padding: 13 }}>
                  <Grid mb={4} mt={2} container spacing={2}>
                    {!isLoading &&
                      data?.payload
                        ?.filter((c) => c.completed)
                        .map((project: IProjects) => (
                          <Grid item key={project._id?.toString()} lg={4} md={4} sm={4} xs={12}>
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
          >
            <Pagination color="primary" count={3} size="small" />
          </Box>
        </Container>
      </Box>
    </>
  )
}
