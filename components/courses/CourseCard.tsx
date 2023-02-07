import React from "react"
import Box from "@mui/material/Box"
import Card from "@mui/material/Card"
import CardActions from "@mui/material/CardActions"
import CardContent from "@mui/material/CardContent"
import Button from "@mui/material/Button"
import Paper from "@mui/material/Paper"
import Typography from "@mui/material/Typography"
import { Divider } from "@mui/material"
import { useRouter } from "next/router"
import { CourseModelSchemaType } from "../../schema/CourseSchema"

interface IProps {
  deleteCourse: (id: string) => void
  course: CourseModelSchemaType
}

const CourseCard = ({ course, deleteCourse }: IProps) => {
  const router = useRouter()
  return (
    <Paper elevation={10}>
      <Card sx={{ boxShadow: 5 }}>
        <Button sx={{ width: "100%" }} onClick={() => router.push(`/courses/${course._id}`)}>
          <CardContent style={{ padding: 0 }}>
            <Typography variant="h5" component="div">
              {course.content.title}
            </Typography>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              {course.content.institution}
            </Typography>

            <Typography variant="body2">{course.content.description}</Typography>
          </CardContent>
        </Button>
        <Divider />
        <CardActions>
          <Button size="small">Go to course (link)</Button>
          <Button onClick={() => deleteCourse(course._id as string)} color="error" size="small">
            Delete
          </Button>
        </CardActions>
      </Card>
    </Paper>
  )
}

export default CourseCard
