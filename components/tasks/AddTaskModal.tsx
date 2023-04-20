import React, { ChangeEvent, useState, useEffect } from "react"
import TextField from "@mui/material/TextField"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import Button from "@mui/material/Button"
import { ClickEventRet, SetState } from "../../types/generics"
import { PrioEnum, TaskFormInputType } from "../../schema/TaskSchema"
import { IZodFormValidation } from "zod-react-form"
import { InitialActivityFromState, InitialZodFormState } from "./Tasks"
import { useCourses, useProjects } from "../../lib/hooks"
import { CourseModelSchemaType } from "../../schema/CourseSchema"
import { ProjectModelType } from "../../schema/ProjectSchema"
import { Autocomplete, Box, Typography, Checkbox, FormControl, InputLabel, MenuItem, Select, Divider } from "@mui/material"
import * as A from "fp-ts/Array"
import * as O from "fp-ts/Option"
import { pipe } from "fp-ts/function"

interface IProps {
  open: boolean
  handleClose: SetState<void>
  onAddTask: ClickEventRet<Promise<void>>
  zodForm: IZodFormValidation<InitialZodFormState>
  setActivityFormState: SetState<InitialActivityFromState>
}

interface ActivitesData {
  id: string | undefined
  name: string
  group: string
}

const getCourses = (data: CourseModelSchemaType[]): ActivitesData[] =>
  data.map((d) => ({
    id: d._id,
    name: d.content.title,
    group: "Courses",
  }))

const getProjects = (data: ProjectModelType[]): ActivitesData[] =>
  data.map((d) => ({
    id: d._id,
    name: d.title,
    group: "Projects",
  }))

const AddTaskModal = ({ open, handleClose, onAddTask, zodForm, setActivityFormState }: IProps) => {
  const { title, description, completed, prio } = zodForm.values

  const onChange = (key: string, value: string | boolean) => {
    zodForm.setFieldValue(key as keyof InitialZodFormState, value)
  }

  const [activites, setActivites] = useState<ActivitesData[]>([])

  const { data: courseData } = useCourses()
  const { data: projectData } = useProjects()

  /*
  useEffect(() => {
    const courses = pipe(
      courseData?.payload,
      O.fromNullable,
      O.map(
        A.map((d) => ({
          id: d._id,
          name: d.content.title,
          group: "Projects",
        }))
      ),
      O.fold(
        () => [],
        (d) => d
      )
    )

    const projects = pipe(
      projectData?.payload,
      O.fromNullable,
      O.map((data) => getProjects(data.payload)),
      O.getOrElse(() => [])
    )

    setActivites([...courses, ...projects])
  }, [coursesOption, projectsOption])
  */

  useEffect(() => {
    if (courseData?.payload && projectData?.payload) {
      setActivites([...getCourses(courseData.payload), ...getProjects(projectData.payload)])
    }
  }, [courseData?.payload, projectData?.payload])

  const handleActivityChange = (e: React.SyntheticEvent, value: ActivitesData | null) => {
    setActivityFormState((prevState) => ({
      ...prevState,
      activityName: value?.name || "",
      activityId: value?.id || "",
      activityGroup: value?.group || "",
    }))
  }

  const onClose = () => {
    handleClose()
  }
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add task</DialogTitle>
      <DialogContent>
        <DialogContentText>Add a task or todo here</DialogContentText>
        <Box component="form">
          <TextField
            name="title"
            value={title}
            autoFocus
            margin="dense"
            id="name"
            label="Title"
            type="text"
            fullWidth
            required
            onChange={(e) => onChange(e.target.name, e.target.value)}
            onBlur={() => zodForm.onBlur("title")}
            helperText={(zodForm.touched.title && zodForm.errors.title) || " "}
            error={Boolean(zodForm.touched.title && zodForm.errors.title)}
          />
          <TextField
            name="description"
            value={description}
            margin="dense"
            id="description"
            label="Description"
            type="text"
            fullWidth
            required
            onChange={(e) => onChange(e.target.name, e.target.value)}
            onBlur={() => zodForm.onBlur("description")}
            helperText={(zodForm.touched.description && zodForm.errors.description) || " "}
            error={Boolean(zodForm.touched.description && zodForm.errors.description)}
          />
          <Box>
            <Typography variant="caption" color="text" component={"span"}>
              Completed?
            </Typography>
            <Checkbox
              onChange={(event: ChangeEvent<HTMLInputElement>) => zodForm.setFieldValue("completed", event.target.checked)}
              value={zodForm.values.completed}
            />
          </Box>

          <FormControl fullWidth style={{ marginTop: 20, marginBottom: 20 }}>
            <InputLabel>Task prio</InputLabel>
            <Select
              value={prio}
              label="Task prio"
              name="prio"
              onChange={(e) => onChange(e.target.name, e.target.value)}
              onBlur={() => zodForm.onBlur("prio")}
              error={Boolean(zodForm.touched.prio && zodForm.errors.prio)}
            >
              <MenuItem value={PrioEnum.Enum.Low}>Low</MenuItem>
              <MenuItem value={PrioEnum.Enum.Medium}>Medium</MenuItem>
              <MenuItem value={PrioEnum.Enum.High}>High</MenuItem>
            </Select>
          </FormControl>

          <Typography variant="caption" color="text" component={"span"}>
            Link task with an activity?
          </Typography>
          <Autocomplete
            id="grouped-demo"
            options={activites}
            onChange={handleActivityChange}
            groupBy={(option) => option.group}
            getOptionLabel={(option) => option.name}
            sx={{ marginTop: 2 }}
            renderInput={(params) => <TextField {...params} label="Activity" />}
          />
        </Box>
      </DialogContent>
      <Divider sx={{ marginBottom: 2 }} />
      <DialogActions>
        <Button color="error" onClick={onClose}>
          Cancel
        </Button>
        <Button
          color="success"
          onClick={onAddTask}
          disabled={zodForm.isDisabled() || Object.values(zodForm.errors).some((error) => error)}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddTaskModal
