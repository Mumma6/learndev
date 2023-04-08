import React, { useState, useEffect } from "react"
import { Box, Container, Grid, Pagination, Card, CardContent, Typography, Divider, CardHeader } from "@mui/material"
import { toast } from "react-toastify"
import { ClickEvent } from "../../types/generics"
import { fetcher } from "../../lib/axiosFetcher"
import { Skill } from "../../constants/skillsData"
import { useProjects } from "../../lib/hooks"
import { useSWRConfig } from "swr"
import ProjectsToolbar from "./ProjectsToolbar"
import ProjectCard from "./ProjectCard"
import Tabs from "@mui/material/Tabs"
import Tab from "@mui/material/Tab"

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

export const initialProjectsFormData: Omit<ProjectModelFromInputType, "techStack"> = {
  title: "",
  description: "",
  sourceCodeUrl: "",
  deployedUrl: "",
  status: ProjectStatusEnum.Enum["In progress"],
}

/*

Använd mui tabs. En för varje status.
https://mui.com/material-ui/react-tabs/
använd "centered" och disabla sånt som är tomt?

Gör mindre kort.

Sök visar resultat per tab

*/

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

  const onAddProject = async (event: ClickEvent) => {
    event.preventDefault()
    try {
      setIsLoading(true)

      const response = await fetcher<undefined, ProjectModelFromInputType>("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: {
          ...zodForm.values,
          techStack: topicData,
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
    const response = await fetcher(`/api/projects?id=${id}`, {
      method: "DELETE",
    })

    if (response?.error) {
      toast.error(response.error)
    } else {
      mutate("/api/projects")
      toast.success(response?.message)
    }
  }

  const handleChange = (event: React.SyntheticEvent, newValue: ProjectStatusEnumType) => {
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
          <Box sx={{ pt: 3 }}>
            <Box sx={{ mt: 1, mb: 1 }}>
              <Card sx={{ marginTop: 4 }}>
                <CardHeader
                  title={
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <Tabs value={statusValue} onChange={handleChange} aria-label="basic tabs example">
                        <Tab label="In progress" value={StatusEnum.Enum["In progress"]} />
                        <Tab label="Done" value={StatusEnum.Enum.Done} />
                        <Tab label="Wishlist" value={StatusEnum.Enum.Wishlist} />
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
