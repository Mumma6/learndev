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
        <Box sx={{ minHeight: 150 }}>
          <Button sx={{ width: "100%" }} onClick={() => router.push(`/courses/${course._id}`)}>
            <CardContent style={{ padding: 0 }}>
              <Typography sx={{ wordWrap: "break-word", marginTop: 3 }} variant="h6">
                {course.content.title}
              </Typography>
              <Typography sx={{ fontSize: 14, marginTop: 2 }} color="text.secondary" gutterBottom>
                {course.content.institution}
              </Typography>
            </CardContent>
          </Button>
        </Box>
        <Divider />
        <CardActions sx={{ float: "right" }}>
          <Button onClick={() => deleteCourse(course._id as string)} color="error" size="small">
            Delete
          </Button>
        </CardActions>
      </Card>
    </Paper>
  )
}

export default CourseCard
