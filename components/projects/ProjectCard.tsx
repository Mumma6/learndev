import React from "react"
import Box from "@mui/material/Box"
import Card from "@mui/material/Card"
import CardActions from "@mui/material/CardActions"
import CardContent from "@mui/material/CardContent"
import Button from "@mui/material/Button"
import Paper from "@mui/material/Paper"
import Typography from "@mui/material/Typography"
import { Divider } from "@mui/material"
import { ICourse } from "../../models/Course"
import { useRouter } from "next/router"
import { IProjects } from "../../models/Projects"

interface IProps {
  deleteProject: (id: string) => void
  project: IProjects
}

// Make the card abit higer and allow the shortDescription to use 2 rows and also increase the max value

const ProjectCard = ({ project, deleteProject }: IProps) => {
  const router = useRouter()
  return (
    <Paper elevation={10}>
      <Card sx={{ boxShadow: 5 }}>
        <Button sx={{ width: "100%" }} onClick={() => router.push(`/projects/${project._id}`)}>
          <CardContent style={{ padding: 0 }}>
            <Typography variant="h5" component="div">
              {project.title}
            </Typography>

            <Typography variant="body2">{project.shortDescription}</Typography>
          </CardContent>
        </Button>
        <Divider />
        <CardActions>
          <Button onClick={() => deleteProject(project._id as string)} color="error" size="small">
            Delete
          </Button>
        </CardActions>
      </Card>
    </Paper>
  )
}

export default ProjectCard
