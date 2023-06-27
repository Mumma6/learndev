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
import { type ProjectModelType } from "../../schema/ProjectSchema"

interface IProps {
  deleteProject: (id: string) => void
  project: ProjectModelType
}

// Make the card abit higer and allow the shortDescription to use 2 rows and also increase the max value

// same card as course - make a generic compoent

const ProjectCard = ({ project, deleteProject }: IProps) => {
  const router = useRouter()
  return (
    <Paper elevation={10}>
      <Card sx={{ boxShadow: 5 }}>
        <Box sx={{ minHeight: 100, textAlign: "center" }}>
          <CardContent style={{ padding: 0 }}>
            <Typography variant="h6" component="div" sx={{ marginTop: 2 }}>
              {project.title}
            </Typography>
          </CardContent>
        </Box>
        <Divider />
        <CardActions sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button onClick={async () => await router.push(`/projects/${project._id}`)}>Go to</Button>
          <Button onClick={() => { deleteProject(project._id) }} color="error" size="small">
            Delete
          </Button>
        </CardActions>
      </Card>
    </Paper>
  )
}

export default ProjectCard
