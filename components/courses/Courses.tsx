import { Box, Container, Grid, Pagination } from "@mui/material"
import React from "react"
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

const courses: ICourse[] = [
  {
    _id: 1,
    title: "React 1.0",
    description: "Beginner course about react",
    institution: "Udemy",
    url: "www.udemy.com",
  },
  {
    _id: 2,
    title: "Node master",
    description: "Advance course about node",
    institution: "Udemy",
    url: "www.udemy.com",
  },
  {
    _id: 3,
    title: "Functional programming",
    description: "Course about FP",
    institution: "Pluralsight",
    url: "www.pluralsight.com",
  },
  {
    _id: 4,
    title: "CSS & HTML",
    description: "Beginner course about css and html",
    institution: "Youtube",
    url: "www.youtube.com",
  },
]

const Courses = () => {
  const [open, setOpen] = React.useState(false)

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
            {courses.map((course) => (
              <Grid item key={course._id} lg={4} md={6} xs={12}>
                <CourseCard course={course} />
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
