import React, { useState } from "react"
import { Box, Container, Grid, Pagination, Card, CardContent, Typography, Divider, CardHeader } from "@mui/material"
import TasksToolbar from "./TasksToolbar"
import CardHeaderTitle from "../shared/CardHeaderTitle"
import TaskDataGrid from "./TaskDataGrid"
import FormGroup from "@mui/material/FormGroup"
import FormControlLabel from "@mui/material/FormControlLabel"
import Switch from "@mui/material/Switch"
import Button from "@mui/material/Button"
import AddTaskModal from "./AddTaskModal"
import { PrioEnum, TaskFormInputSchema, TaskFormInputType, TaskModelType, TaskPrioEnumType } from "../../schema/TaskSchema"
import { useZodFormValidation } from "zod-react-form"
import { useTasks } from "../../lib/hooks"
import { useSWRConfig } from "swr"
import { pipe } from "fp-ts/function"
import * as A from "fp-ts/Array"
import * as O from "fp-ts/Option"
import * as TE from "fp-ts/TaskEither"
import { fetcherTE } from "../../lib/axiosFetcher"
import { toast } from "react-toastify"

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

export type InitialZodFormState = Omit<TaskFormInputType, "activityName" | "activityId" | "activityGroup">

export type InitialActivityFromState = Pick<TaskFormInputType, "activityName" | "activityId" | "activityGroup">

export const initialTaskFormstate: InitialZodFormState = {
  title: "",
  description: "",
  completed: false,
  prio: PrioEnum.Enum["Medium"],
}

export const initialActivityTaskFormstate: InitialActivityFromState = {
  activityName: "",
  activityId: "",
  activityGroup: "",
}

const Tasks = () => {
  const [open, setOpen] = useState(false)
  const [activityFormState, setActivityFormState] = useState(initialActivityTaskFormstate)
  const [isLoading, setIsLoading] = useState(false)

  const { data } = useTasks()

  // pass these to the datagrid
  console.log(data)
  const { mutate } = useSWRConfig()

  const zodForm = useZodFormValidation<InitialZodFormState>(TaskFormInputSchema, initialTaskFormstate)

  const resetForm = () => {
    setIsLoading(false)
    handleClose()
  }

  const onAddTask = async () => {
    setIsLoading(true)
    pipe(
      fetcherTE<TaskModelType, TaskFormInputType>("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: {
          ...zodForm.values,
          ...activityFormState,
        },
      }),
      TE.fold(
        (error) => {
          toast.error(error)
          resetForm()
          return TE.left(error)
        },
        (data) => {
          toast.error(data.message)
          mutate("/api/tasks")
          resetForm()
          return TE.right(data)
        }
      )
    )()
  }

  const toggleTask = async (_id: string, completed: boolean) => {
    pipe(
      fetcherTE<TaskModelType, Partial<TaskModelType>>("/api/tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        data: {
          _id,
          completed,
        },
      }),
      TE.fold(
        (error) => {
          toast.error(error)
          return TE.left(error)
        },
        (response) => {
          mutate("/api/tasks")
          return TE.right(response)
        }
      )
    )()
  }

  const deleteTask = async (id: string) => {
    pipe(
      fetcherTE(`/api/tasks?id=${id}`, { method: "DELETE" }),
      TE.fold(
        (error) => {
          toast.error(error)
          return TE.left(error)
        },
        (response) => {
          mutate("/api/tasks")
          toast.success(response?.message)
          return TE.right(response)
        }
      )
    )()
  }

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    zodForm.setValues(initialTaskFormstate)
    setActivityFormState(initialActivityTaskFormstate)

    setOpen(false)
  }

  return (
    <Box
      component="main"
      sx={{
        paddingTop: 10,
      }}
    >
      <Container maxWidth={false}>
        <AddTaskModal
          open={open}
          handleClose={handleClose}
          zodForm={zodForm}
          onAddTask={onAddTask}
          setActivityFormState={setActivityFormState}
        />
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
                <TaskDataGrid tasks={data?.payload || []} deleteTask={deleteTask} toggleTask={toggleTask} />
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default Tasks
