import { Box, Container, Grid, Pagination } from "@mui/material"
import { useEffect, useState } from "react"
import { useCourses } from "../../lib/hooks"
import { useSWRConfig } from "swr"
import AddCourseModal from "./AddCourseModal"
import CourseCard from "./CourseCard"
import CoursesToolbar from "./CoursesToolbar"
import { toast } from "react-toastify"
import { ClickEvent } from "../../types/generics"
import { fetcher1 } from "../../lib/axiosFetcher"
import { ICourse } from "../../models/Course"

export enum Institution {
  Udemy = "Udemy",
  Youtube = "Youtube",
  Pluralsight = "Pluralsight",
  Other = "Other",
}

export interface CourseFormData {
  title: string
  description: string
  institution: Institution
  url: string
}

export const initialCourseFormState: CourseFormData = {
  title: "",
  description: "",
  institution: Institution.Other,
  url: "",
}

const Courses = () => {
  const [open, setOpen] = useState(false)
  const [courseFormData, setCourseFormData] = useState<CourseFormData>(initialCourseFormState)
  const [isLoading, setIsLoading] = useState(false)

  const { data } = useCourses()
  const { mutate } = useSWRConfig()
  console.log(data)


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

      const response = await fetcher1("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: {
          content: courseFormData,
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
      />
      <Container maxWidth={false}>
        <CoursesToolbar handleClickOpen={handleClickOpen} />
        <Box sx={{ pt: 3 }}>
          <Grid container spacing={3}>
            {!isLoading &&
              data?.payload?.map((course: ICourse) => (
                <Grid item key={course._id} lg={4} md={6} xs={12}>
                  <CourseCard deleteCourse={deleteCourse} course={course} />
                </Grid>
              ))}
          </Grid>
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
