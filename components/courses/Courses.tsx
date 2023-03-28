import { Box, Container, Grid, Pagination, Card, CardContent, Typography, Divider, CardHeader } from "@mui/material"
import { useEffect, useState } from "react"
import { useCourses } from "../../lib/hooks"
import { useSWRConfig } from "swr"
import AddCourseModal from "./AddCourseModal"
import CourseCard from "./CourseCard"
import CoursesToolbar from "./CoursesToolbar"
import { toast } from "react-toastify"
import { ClickEvent } from "../../types/generics"
import { fetcher } from "../../lib/axiosFetcher"
import {
  CourseModelContentInputSchema,
  CourseModelContentInputSchemaType,
  CourseModelformInputSchema,
  CourseModelformInputType,
  InstitutionEnum,
} from "../../schema/CourseSchema"
import { SkillSchemaType } from "../../schema/SharedSchema"
import { useZodFormValidation } from "zod-react-form"

/*
Lägga till en wishlist med kurser?

Göra korten mindre?

lägg knappen  "gå till" brevid delete

*/

export const initialCourseFormState: CourseModelContentInputSchemaType = {
  title: "",
  description: "",
  institution: InstitutionEnum.Enum.Other,
  url: "",
  certificateUrl: "",
  duration: 0,
}

const Courses = () => {
  const [open, setOpen] = useState(false)
  const [topicData, setTopicData] = useState<SkillSchemaType[]>([])
  const [completed, setCompleted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { values, setValues, errors, setFieldValue, onBlur, touched, reset } =
    useZodFormValidation<CourseModelContentInputSchemaType>(CourseModelContentInputSchema, initialCourseFormState)

  const { data } = useCourses()
  const { mutate } = useSWRConfig()

  const deleteCourse = async (id: string) => {
    console.log("deleing", id)
    const response = await fetcher(`/api/courses?id=${id}`, {
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

      const response = await fetcher<undefined, CourseModelformInputType>("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: {
          content: values,
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
      setValues(initialCourseFormState)
      setIsLoading(false)
      handleClose()
    }
  }

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setValues(initialCourseFormState)
    setTopicData([])
    setCompleted(false)
    reset()
    setOpen(false)
  }
  return (
    <Box
      component="main"
      sx={{
        paddingTop: 10,
      }}
    >
      <AddCourseModal
        open={open}
        handleClose={handleClose}
        formValues={values}
        onAddCourse={onAddCourse}
        setCompleted={setCompleted}
        setTopicData={setTopicData}
        topicData={topicData}
        completed={completed}
        onBlur={onBlur}
        touched={touched}
        setFieldValue={setFieldValue}
        errors={errors}
      />
      <Container maxWidth={false}>
        <CoursesToolbar handleClickOpen={handleClickOpen} />
        <Box sx={{ pt: 3 }}>
          <Box sx={{ mt: 1, mb: 1 }}>
            <Card>
              <CardHeader subheader="Add upcoming and courses you have in progress" title="Courses" />
              <Divider />
              <CardContent>
                <Grid mb={4} mt={2} container spacing={2}>
                  {!isLoading &&
                    data?.payload
                      ?.filter((c) => !c.completed)
                      .map((course) => (
                        <Grid item key={course._id} xl={3} lg={4} md={4} sm={6} xs={12}>
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
          {false && <Pagination color="primary" count={3} size="small" />}
        </Box>
      </Container>
      <Container maxWidth={false}>
        <Box sx={{ pt: 1 }}>
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
                        <Grid item key={course._id} xl={3} lg={4} md={4} sm={6} xs={12}>
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
          {false && <Pagination color="primary" count={3} size="small" />}
        </Box>
      </Container>
    </Box>
  )
}

export default Courses
