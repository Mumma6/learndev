import React, { useState } from "react"
import { Box, Container, Card, CardContent, Divider, CardHeader } from "@mui/material"
import CardHeaderTitle from "../shared/CardHeaderTitle"
import TaskDataGrid from "./TaskDataGrid"

import Button from "@mui/material/Button"
import AddTaskModal from "./AddTaskModal"
import { PrioEnum, TaskFormInputSchema, TaskFormInputType, TaskModelType, TaskPrioEnumType } from "../../schema/TaskSchema"
import { useZodFormValidation } from "zod-react-form"
import { useTasks } from "../../lib/hooks"
import { useSWRConfig } from "swr"
import { pipe } from "fp-ts/function"
import * as TE from "fp-ts/TaskEither"
import { fetcherTE } from "../../lib/axiosFetcher"
import { toast } from "react-toastify"
import InfoTooltip from "../shared/Tooltip"

/*

Add a infoToolTip

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
          toast.success(data.message)
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
    zodForm.reset()
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
                subheader="Create and manage tasks."
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
                <TaskDataGrid tasks={data?.payload} deleteTask={deleteTask} toggleTask={toggleTask} />
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default Tasks
