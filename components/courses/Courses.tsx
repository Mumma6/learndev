import { Box, Container, Grid, Pagination, Card, CardContent, Typography, Divider, CardHeader } from "@mui/material"
import { useEffect, useState } from "react"
import { useCourses } from "../../lib/hooks"
import { useSWRConfig } from "swr"
import AddCourseModal from "./AddCourseModal"
import CourseCard from "./CourseCard"
import CoursesToolbar from "./CoursesToolbar"
import { toast } from "react-toastify"
import { ClickEvent } from "../../types/generics"
import { fetcher1 } from "../../lib/axiosFetcher"
import { CourseModelContentInputSchemaType, CourseModelformInputType, InstitutionEnum } from "../../schema/CourseSchema"
import { SkillSchemaType } from "../../schema/SharedSchema"

export const initialCourseFormState = {
  title: "",
  description: "",
  institution: InstitutionEnum.Enum.Other,
  url: "",
}

const Courses = () => {
  const [open, setOpen] = useState(false)
  const [courseFormData, setCourseFormData] = useState<CourseModelContentInputSchemaType>(initialCourseFormState)
  const [topicData, setTopicData] = useState<SkillSchemaType[]>([])
  const [completed, setCompleted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { data } = useCourses()
  const { mutate } = useSWRConfig()

  const deleteCourse = async (id: string) => {
    console.log("deleing", id)
    const response = await fetcher1(`/api/courses?id=${id}`, {
      method: "DELETE",
    })

    if (response?.error) {
      toast.error(response.error)
    } else {
      mutate("/api/courses")
      toast.success(response?.message)
    }
  }

  const onAddCourse = async (event: ClickEvent) => {
    event.preventDefault()
    try {
      setIsLoading(true)

      const response = await fetcher1<undefined, CourseModelformInputType>("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: {
          content: courseFormData,
          topics: topicData,
          completed,
        },
      })

      if (response?.error) {
        toast.error(response.error)
      } else {
        mutate("/api/courses")
        toast.success(response?.message)
      }
    } catch (e: any) {
      console.log(e)
    } finally {
      setCourseFormData(initialCourseFormState)
      setIsLoading(false)
      handleClose()
    }
  }

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8,
      }}
    >
      <AddCourseModal
        open={open}
        handleClose={handleClose}
        courseFormData={courseFormData}
        setCourseFormData={setCourseFormData}
        onAddCourse={onAddCourse}
        setCompleted={setCompleted}
        setTopicData={setTopicData}
        topicData={topicData}
        completed={completed}
      />
      <Container maxWidth={false}>
        <CoursesToolbar handleClickOpen={handleClickOpen} />
        <Box sx={{ pt: 3 }}>
          <Box sx={{ mt: 3, mb: 3 }}>
            <Card>
              <CardHeader subheader="Upcoming and courses in progress" title="Courses" />
              <Divider />
              <CardContent style={{ padding: 13 }}>
                <Grid mb={4} mt={2} container spacing={2}>
                  {!isLoading &&
                    data?.payload
                      ?.filter((c) => !c.completed)
                      .map((course) => (
                        <Grid item key={course._id} lg={3} md={4} sm={4} xs={12}>
                          <CourseCard deleteCourse={deleteCourse} course={course} />
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
              <CardHeader subheader="Archive of completed courses" title="Completed courses" />
              <Divider />
              <CardContent style={{ padding: 13 }}>
                <Grid mb={4} mt={2} container spacing={2}>
                  {!isLoading &&
                    data?.payload
                      ?.filter((c) => c.completed)
                      .map((course) => (
                        <Grid item key={course._id} lg={3} md={4} sm={4} xs={12}>
                          <CourseCard deleteCourse={deleteCourse} course={course} />
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
  )
}

export default Courses
