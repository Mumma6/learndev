import React, { useState } from "react"
import { Box, Paper, Card, CardContent, CardHeader, Divider, Container, Button, Typography, Chip } from "@mui/material"
import NextLink from "next/link"
import { FaArrowLeft, FaPen } from "react-icons/fa"
import { CourseModelSchemaType } from "../../schema/CourseSchema"
import EditCourseModal from "./EditCourseModal"
interface IProps {
  course: CourseModelSchemaType
}

// single course

/*
Display all info. Should be able to edit

Add resource stuff here.
Feedback aswell. 


*/
const Course = ({ course }: IProps) => {
  const [open, setOpen] = useState(false)

  const handleClose = () => {
    setOpen(false)
  }
  return (
    <Box
      component="main"
      sx={{
        marginTop: 15,
        paddingBottom: 40,
      }}
    >
      <EditCourseModal open={open} handleClose={handleClose} course={course} />
      <Container maxWidth="lg">
        <Card>
          <Box m={2}>
            <NextLink style={{ textDecoration: "none" }} href="/courses" passHref>
              <Button component="a" startIcon={<FaArrowLeft />}>
                Back
              </Button>
            </NextLink>
            <Button onClick={() => setOpen(true)} sx={{ float: "right" }} variant="contained" startIcon={<FaPen />}>
              Edit
            </Button>
          </Box>
          <CardHeader title={course.content.title} />
          <Box m={2}>
            <NextLink style={{ textDecoration: "none" }} target="_blank" href={course.content.url} passHref>
              <Button component="a">Go to course</Button>
            </NextLink>
            {!!course.content.certificateUrl && (
              <NextLink style={{ textDecoration: "none" }} target="_blank" href={course.content.certificateUrl} passHref>
                <Button component="a">View certificate</Button>
              </NextLink>
            )}
          </Box>
          <Divider />
          <CardContent>
            <Box>{course.content.description}</Box>
          </CardContent>
          <Divider />
          <Box sx={{ marginTop: 3 }}>
            <Typography sx={{ marginLeft: 2.5 }} color="textPrimary" variant="h6">
              Topics
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "start",
                flexWrap: "wrap",
                listStyle: "none",
                p: 1.5,
                mt: 3,
              }}
              component="ul"
            >
              {course.topics.map((data) => (
                <Chip key={data.label} color="primary" label={data.label} sx={{ marginRight: 1 }} />
              ))}
            </Box>
          </Box>
        </Card>
      </Container>
    </Box>
  )
}

export default Course
