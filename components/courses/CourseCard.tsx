import React from "react"
import Box from "@mui/material/Box"
import Card from "@mui/material/Card"
import CardActions from "@mui/material/CardActions"
import CardContent from "@mui/material/CardContent"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import { Divider } from "@mui/material"
import { ICourse } from "./Courses"

interface IProps {
  course: ICourse
}

const CourseCard = ({ course }: IProps) => {
  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography variant="h5" component="div">
          {course.title}
        </Typography>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {course.institution}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          start - slut
        </Typography>
        <Typography variant="body2">{course.description}</Typography>
      </CardContent>
      <Divider />
      <CardActions>
        <Button size="small">Go to course (link)</Button>
        <Button size="small">Edit (öppna modal)</Button>
      </CardActions>
    </Card>
  )
}

export default CourseCard
