import React from "react"
import { Box, Paper, Card, CardContent, CardHeader, Divider, Container, Button } from "@mui/material"
import { ICourse } from "../../models/Course"
import NextLink from "next/link"
import { FaArrowLeft } from "react-icons/fa"
interface IProps {
  course: ICourse
}

// single course

/*
Display all info. Should be able to edit

Add resource stuff here.
Feedback aswell. 


*/
const Course = ({ course }: IProps) => {
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8,
      }}
    >
      <Container maxWidth="lg">
        <Card>
          <Box m={2}>
            <NextLink style={{ textDecoration: "none" }} href="/courses" passHref>
              <Button component="a" startIcon={<FaArrowLeft />}>
                Back
              </Button>
            </NextLink>
          </Box>
          <CardHeader subheader={course.content.description} title={course.content.title} />
          <Divider />
          <CardContent>{course.content.description}</CardContent>
          <Divider />
        </Card>
      </Container>
    </Box>
  )
}

export default Course
