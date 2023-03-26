import React, { useState } from "react"
import { Box, Container, Grid, Pagination, Card, CardContent, Typography, Divider, CardHeader } from "@mui/material"
import TasksToolbar from "./TasksToolbar"

/*
Tasks should show up when going to /course | project/id

When clicking on the they should show up below. 

Make cards smaller then projects. 5 on each row.
two buttons, delete and toggle done
Also show prio.

completed are greyish and can only be deleted. they are also sorted last.

*/

const Tasks = () => {
  const [open, setOpen] = useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }

  return (
    <Box
      component="main"
      sx={{
        paddingTop: 10,
      }}
    >
      <Container maxWidth={false}>
        <TasksToolbar handleClickOpen={handleClickOpen} />
        <Box sx={{ pt: 3 }}>
          <Box sx={{ mt: 1, mb: 1 }}>
            <Card>
              <CardHeader subheader="Create and manage tasks and todos" title="Tasks" />
              <Divider />
              <CardContent>
                <h1>Coming soon</h1>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default Tasks
