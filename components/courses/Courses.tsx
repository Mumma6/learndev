import { Box, Container, Grid, Pagination } from "@mui/material"
import { useEffect, useState } from "react"
import { useCourses } from "../../lib/hooks"
import AddCourseModal from "./AddCourseModal"
import CourseCard from "./CourseCard"
import CoursesToolbar from "./CoursesToolbar"

export interface ICourse {
  _id: number
  title: string
  description: string
  institution: string
  url?: string
}

const Courses = () => {
  const [open, setOpen] = useState(false)

  const { data } = useCourses()
  console.log(data)

  useEffect(() => {
    console.log("in usereffect", data)
    if (!data) return
    if (data?.courses === null) {
      console.log("no user")
    }
  }, [data])

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
      <AddCourseModal open={open} handleClose={handleClose} />
      <Container maxWidth={false}>
        <CoursesToolbar handleClickOpen={handleClickOpen} />
        <Box sx={{ pt: 3 }}>
          <Grid container spacing={3}>
            {data?.courses.map((course: any) => (
              <Grid item key={course._id} lg={4} md={6} xs={12}>
                <CourseCard course={course.content} />
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
