import { Box, Container, Grid, Pagination, Card, CardContent, Typography, Divider, CardHeader } from "@mui/material"
import Tabs from "@mui/material/Tabs"
import Tab from "@mui/material/Tab"
import { pipe } from "fp-ts/function"
import * as A from "fp-ts/Array"

import * as O from "fp-ts/Option"
import * as TE from "fp-ts/TaskEither"

import { useEffect, useState } from "react"
import { useCourses } from "../../lib/hooks"
import { useSWRConfig } from "swr"
import AddCourseModal from "./AddCourseModal"
import CourseCard from "./CourseCard"
import CoursesToolbar from "./CoursesToolbar"
import { toast } from "react-toastify"
import { fetcher, fetcherTE } from "../../lib/axiosFetcher"
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
import { getOArraySize } from "../../helpers/helpers"

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

  const handleChange = (_: React.SyntheticEvent, newValue: StatusEnumType) => {
    setStatusValue(newValue)
  }

  const zodForm = useZodFormValidation<CourseModelContentInputSchemaType>(
    CourseModelContentInputSchema,
    initialCourseFormState
  )

  const { data } = useCourses()
  const { mutate } = useSWRConfig()

  const getNumberOfStatuses = (status: StatusEnumType) =>
    pipe(O.fromNullable(data?.payload), O.map(A.filter((d) => d.content.status === status)), getOArraySize)

  useEffect(() => {
    if (data?.payload) {
      return setDataToShow(data?.payload?.filter((c) => c.content.status === statusValue))
    }
  }, [statusValue, data])

  const deleteCourse = async (id: string) => {
    pipe(
      fetcherTE(`/api/courses?id=${id}`, { method: "DELETE" }),
      TE.fold(
        (error) => {
          toast.error(error)
          return TE.left(error)
        },
        (response) => {
          mutate("/api/courses")
          toast.success(response?.message)
          return TE.right(response)
        }
      )
    )()
  }

  const resetForm = () => {
    zodForm.setValues(initialCourseFormState)
    setIsLoading(false)
    handleClose()
  }

  const onAddCourse = async () => {
    setIsLoading(true)
    pipe(
      fetcherTE<CourseModelSchemaType, CourseModelformInputType>("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: {
          content: zodForm.values,
          topics: topicData,
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
          mutate("/api/courses")
          resetForm()
          return TE.right(data)
        }
      )
    )()
  }

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    zodForm.setValues(initialCourseFormState)
    setTopicData([])
    zodForm.reset()
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
        onAddCourse={onAddCourse}
        setTopicData={setTopicData}
        topicData={topicData}
        zodForm={zodForm}
      />
      <Container maxWidth={false}>
        <CoursesToolbar handleClickOpen={handleClickOpen} />
        <Card sx={{ marginTop: 4 }}>
          <CardHeader
            title={
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Tabs value={statusValue} onChange={handleChange} aria-label="basic tabs example">
                  <Tab
                    label={`In progress (${getNumberOfStatuses("In progress")})`}
                    value={StatusEnum.Enum["In progress"]}
                  />
                  <Tab label={`Done (${getNumberOfStatuses("Done")})`} value={StatusEnum.Enum.Done} />
                  <Tab label={`Wishlist (${getNumberOfStatuses("Wishlist")})`} value={StatusEnum.Enum.Wishlist} />
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
