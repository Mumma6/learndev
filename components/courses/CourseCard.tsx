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
import { type CourseModelSchemaType } from "../../schema/CourseSchema"

interface IProps {
  deleteCourse: (id: string) => void
  course: CourseModelSchemaType
}

// this is same as project card.

// breddare och  allt brevid varandra

const CourseCard = ({ course, deleteCourse }: IProps) => {
  const router = useRouter()
  return (
    <Paper elevation={10}>
      <Card sx={{ boxShadow: 5 }}>
        <CardContent style={{ padding: 0 }}>
          <Box sx={{ minHeight: 100, textAlign: "center" }}>
            <Typography sx={{ wordWrap: "break-word", marginTop: 3 }} variant="h6">
              {course.content.title}
            </Typography>
            <Typography sx={{ fontSize: 14, marginTop: 2 }} color="text.secondary" gutterBottom>
              {course.content.institution}
            </Typography>
          </Box>
        </CardContent>

        <Divider />
        <CardActions sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button onClick={async () => await router.push(`/courses/${course._id}`)}>Go to</Button>
          <Button onClick={() => { deleteCourse(course._id) }} color="error" size="small">
            Delete
          </Button>
        </CardActions>
      </Card>
    </Paper>
  )
}

export default CourseCard
