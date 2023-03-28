import React, { useState } from "react"
import { Box, Container, Grid, Pagination, Card, CardContent, Typography, Divider, CardHeader } from "@mui/material"
import TasksToolbar from "./TasksToolbar"
import CardHeaderTitle from "../shared/CardHeaderTitle"
import TaskDataGrid from "./TaskDataGrid"
import FormGroup from "@mui/material/FormGroup"
import FormControlLabel from "@mui/material/FormControlLabel"
import Switch from "@mui/material/Switch"
import Button from "@mui/material/Button"

/*
Tasks should show up when going to /course | project/id

When clicking on the they should show up below. 

Make cards smaller then projects. 5 on each row.
two buttons, delete and toggle done
Also show prio.

completed are greyish and can only be deleted. they are also sorted last.

----------------------------TODO--------------

Should use mui data tabel.

We want to be able to sort on and display
- name
- activity group (project, kurs, quizz, inget)
- completed/not completed
- created at
- prio

show description and buttons when clicking?


There should be buttons to go to the activity if any
Button to set completed
button to delete


display the same or a normal tabel list under projects and courses.



modal to add.

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
        <Box sx={{ pt: 3 }}>
          <Box sx={{ mt: 1, mb: 1 }}>
            <Card>
              <CardHeader
                subheader="Create and manage tasks and todos."
                title={
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <CardHeaderTitle title="Tasks" />
                    <div style={{ display: "flex" }}>
                      <Button sx={{ marginLeft: 1 }} color="primary" variant="contained" onClick={handleClickOpen}>
                        Add task
                      </Button>
                    </div>
                  </div>
                }
              />
              <Divider />
              <CardContent>
                <TaskDataGrid />
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default Tasks
