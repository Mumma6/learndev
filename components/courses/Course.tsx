import React from "react"
import { Box, Paper, Card, CardContent, CardHeader, Divider, Container, Button } from "@mui/material"
import NextLink from "next/link"
import { FaArrowLeft } from "react-icons/fa"
import { CourseModelSchemaType } from "../../schema/CourseSchema"
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
          <CardHeader title={course.content.title} />
          <Box m={2}>
            <NextLink style={{ textDecoration: "none" }} target="_blank" href={course.content.url} passHref>
              <Button component="a">Go to course</Button>
            </NextLink>
            {!!course.content.certificateUrl && (
              <NextLink style={{ textDecoration: "none" }} target="_blank" href={course.content.url} passHref>
                <Button component="a">View certificate</Button>
              </NextLink>
            )}
          </Box>
          <Divider />
          <CardContent>{course.content.description}</CardContent>
          <Divider />
        </Card>
      </Container>
    </Box>
  )
}

export default Course
