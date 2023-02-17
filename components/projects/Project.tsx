import React, { useState } from "react"
import { Box, Paper, Card, CardContent, CardHeader, Divider, Container, Button, Chip, Typography } from "@mui/material"
import NextLink from "next/link"
import { FaArrowLeft, FaPen, FaPenAlt } from "react-icons/fa"
import { ProjectModelType, ProjectModelFromInputType } from "../../schema/ProjectSchema"
import EditProjectModal from "./EditProjectModal"
import { fetcher1 } from "../../lib/axiosFetcher"
import { ClickEvent } from "../../types/generics"
import { useSWRConfig } from "swr"

interface IProps {
  project: ProjectModelType
}

/*

Edit ska öppna en EditModal. fälten ska populeras från project propen. 
Ska skicka en patch med nya datan (samma som när man skapar, samma schema osv).

Kolla hur User gör med sin patch. Behöver vi ett lika avancerat defaultValues() här?

*/

const Project = ({ project }: IProps) => {
  const [open, setOpen] = useState(false)

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
      <EditProjectModal open={open} handleClose={handleClose} project={project} />
      <Container maxWidth="lg">
        <Card>
          <Box m={2}>
            <NextLink style={{ textDecoration: "none" }} href="/projects" passHref>
              <Button component="a" startIcon={<FaArrowLeft />}>
                Back
              </Button>
            </NextLink>
            <Button onClick={() => setOpen(true)} sx={{ float: "right" }} variant="contained" startIcon={<FaPen />}>
              Edit
            </Button>
          </Box>
          <CardHeader title={project.title} />
          <Box m={2}>
            {!!project.deployedUrl && (
              <NextLink style={{ textDecoration: "none" }} target="_blank" href={project.deployedUrl} passHref>
                <Button component="a">View demo</Button>
              </NextLink>
            )}
            {!!project.sourceCodeUrl && (
              <NextLink style={{ textDecoration: "none" }} target="_blank" href={project.sourceCodeUrl} passHref>
                <Button component="a">View source code</Button>
              </NextLink>
            )}
          </Box>
          <Divider />
          <CardContent>{project.description}</CardContent>
          <Divider />
          <Box sx={{ marginTop: 3 }}>
            <Typography sx={{ marginLeft: 2.5 }} color="textPrimary" variant="h6">
              Tech stack
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
              {project.techStack.map((data) => (
                <Chip key={data.label} color="primary" label={data.label} sx={{ marginRight: 1 }} />
              ))}
            </Box>
          </Box>
        </Card>
      </Container>
    </Box>
  )
}

export default Project

/*
Visa bilder i framtiden
tags?

*/
