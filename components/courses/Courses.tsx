import { Box, Container, Grid, Pagination, Card, CardContent, Typography, Divider, CardHeader } from "@mui/material"
import Tabs from "@mui/material/Tabs"
import Tab from "@mui/material/Tab"

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
  CourseModelSchemaType,
  CourseModelformInputSchema,
  CourseModelformInputType,
  InstitutionEnum,
  StatusEnum,
  StatusEnumType,
} from "../../schema/CourseSchema"
import { SkillSchemaType } from "../../schema/SharedSchema"
import { useZodFormValidation } from "zod-react-form"
import InfoTooltip from "../shared/Tooltip"

/*
Lägga till en wishlist med kurser?

Göra korten mindre?

lägg knappen  "gå till" brevid delete

*/

export const initialCourseFormState: CourseModelContentInputSchemaType = {
  title: "",
  description: "",
  institution: InstitutionEnum.Enum.Other,
  status: StatusEnum.Enum["In progress"],
  url: "",
  certificateUrl: "",
  duration: 0,
}

const Courses = () => {
  const [open, setOpen] = useState(false)
  const [topicData, setTopicData] = useState<SkillSchemaType[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [dataToShow, setDataToShow] = useState<CourseModelSchemaType[]>([])
  const [statusValue, setStatusValue] = useState<StatusEnumType>("In progress") // show correct courses based on this state

  const handleChange = (event: React.SyntheticEvent, newValue: StatusEnumType) => {
    setStatusValue(newValue)
  }

  const { values, setValues, errors, setFieldValue, onBlur, touched, reset } =
    useZodFormValidation<CourseModelContentInputSchemaType>(CourseModelContentInputSchema, initialCourseFormState)

  const { data } = useCourses()
  const { mutate } = useSWRConfig()

  useEffect(() => {
    if (data?.payload) {
      return setDataToShow(data?.payload?.filter((c) => c.content.status === statusValue))
    }
  }, [statusValue, data])

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

      const response = await fetcher<CourseModelSchemaType, CourseModelformInputType>("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: {
          content: values,
          topics: topicData,
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
        setTopicData={setTopicData}
        topicData={topicData}
        onBlur={onBlur}
        touched={touched}
        setFieldValue={setFieldValue}
        errors={errors}
      />
      <Container maxWidth={false}>
        <CoursesToolbar handleClickOpen={handleClickOpen} />
        <Card sx={{ marginTop: 4 }}>
          <CardHeader
            title={
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Tabs value={statusValue} onChange={handleChange} aria-label="basic tabs example">
                  <Tab label="In progress" value={StatusEnum.Enum["In progress"]} />
                  <Tab label="Done" value={StatusEnum.Enum.Done} />
                  <Tab label="Wishlist" value={StatusEnum.Enum.Wishlist} />
                </Tabs>
                <InfoTooltip text="Keep track of all your courses here. Add courses you have completed, working on at this moment and courses you want to take in the future" />
              </div>
            }
          />
          <Divider />
          <CardContent>
            <Grid mb={4} mt={2} container spacing={2}>
              {!isLoading &&
                dataToShow.map((course) => (
                  <Grid item key={course._id} xl={3} lg={3} md={3} sm={6} xs={12}>
                    <CourseCard deleteCourse={deleteCourse} course={course} />
                  </Grid>
                ))}
            </Grid>
          </CardContent>
        </Card>

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
