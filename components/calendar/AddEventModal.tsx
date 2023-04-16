import React, { ChangeEvent, useState, useEffect } from "react"
import TextField from "@mui/material/TextField"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import Button from "@mui/material/Button"
import {
  Autocomplete,
  Box,
  AutocompleteRenderGroupParams,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material"
import Checkbox from "@mui/material/Checkbox"

// Ersätt dayjs med date-fns
import dayjs, { Dayjs } from "dayjs"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import Typography from "@mui/material/Typography"
import { ClickEventRet, SetState } from "../../types/generics"
import { ExternEventFormData } from "./StudyCalendar"
import { DateTimePicker } from "@mui/x-date-pickers"
import { useCourses, useCurrentUser, useProjects, useQuizzes } from "../../lib/hooks"
import { CourseModelSchemaType } from "../../schema/CourseSchema"
import { ProjectModelType } from "../../schema/ProjectSchema"
import { IQuiz } from "../../models/Quiz"
import { UserSettingsLabelType } from "../../schema/UserSchema"
import { ActivitesData, getCourses, getProjects, getQuizzes } from "./calendarUtils"

interface IProps {
  open: boolean
  handleClose: SetState<void>
  externEventFormData: ExternEventFormData
  setExternEventFormData: SetState<ExternEventFormData>
  onAddExternEvent: ClickEventRet<void>
  labels: UserSettingsLabelType[]
}

const AddEventModal = ({
  open,
  handleClose,
  externEventFormData,
  setExternEventFormData,
  onAddExternEvent,
  labels,
}: IProps) => {
  // detta är en copy paste i båda modalerna, gör en customHook
  const [activites, setActivites] = useState<ActivitesData[]>([])

  const { data: courseData } = useCourses()
  const { data: projectData } = useProjects()
  const { data: quizzData } = useQuizzes()
  const { data: userData } = useCurrentUser()

  useEffect(() => {
    if (courseData?.payload && projectData?.payload && quizzData?.payload) {
      setActivites([
        ...getCourses(courseData.payload),
        ...getProjects(projectData.payload),
        ...getQuizzes(quizzData.payload, userData?.payload?.completedQuizzes as string[]),
      ])
    }
  }, [courseData?.payload, projectData?.payload, quizzData?.payload])

  // ---------------------------

  const { title, description, start, end, allDay } = externEventFormData

  const onClose = () => {
    handleClose()
  }

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setExternEventFormData((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }))
  }

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    setExternEventFormData((prevState) => ({
      ...prevState,
      allDay: event.target.checked,
    }))
  }

  const handleActivityChange = (e: React.SyntheticEvent, value: ActivitesData | null) => {
    setExternEventFormData((prevState) => ({
      ...prevState,
      activityName: value?.name,
      activityId: value?.id,
      activityGroup: value?.group,
    }))
  }

  const handleLabelChange = (e: React.SyntheticEvent, value: UserSettingsLabelType | null) => {
    setExternEventFormData((prevState) => ({
      ...prevState,
      labelColor: value?.color,
      labelName: value?.name,
    }))
  }

  const isDisabled = () => {
    const checkend = () => {
      if (allDay !== true && end === null) {
        return true
      }
    }
    if (title === "" || description === "" || start === null || checkend()) {
      return true
    }
    return false
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add event</DialogTitle>
      <DialogContent>
        <DialogContentText>To add a event, please fill in the information below.</DialogContentText>
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
            variant="standard"
            onChange={onChange}
          />
          <TextField
            name="description"
            value={description}
            margin="dense"
            id="description"
            label="Description"
            type="text"
            fullWidth
            variant="standard"
            onChange={onChange}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box mb={2} mt={5}>
              <DateTimePicker
                label="Start date"
                value={start}
                ampm={true}
                minutesStep={30}
                onChange={(newValue) => {
                  setExternEventFormData((prevState) => ({
                    ...prevState,
                    start: new Date(newValue!),
                  }))
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </Box>

            <Box>
              <Typography variant="caption" color="text" component={"span"}>
                All day?
              </Typography>
              <Checkbox onChange={handleCheckboxChange} value={allDay} />
            </Box>

            <DateTimePicker
              label="End date"
              disabled={allDay}
              minDate={start}
              minutesStep={30}
              ampm={true}
              value={allDay ? null : end}
              onChange={(newValue) => {
                setExternEventFormData((prevState) => ({
                  ...prevState,
                  end: new Date(newValue!),
                }))
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
          <Autocomplete
            onChange={handleLabelChange}
            disablePortal
            id="combo-box-demo"
            options={labels}
            sx={{ marginTop: 4 }}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => <TextField {...params} label="Label" />}
          />
          <Autocomplete
            id="grouped-demo"
            options={activites}
            onChange={handleActivityChange}
            groupBy={(option) => option.group}
            getOptionLabel={(option) => option.name}
            sx={{ marginTop: 4 }}
            renderInput={(params) => <TextField {...params} label="Activity" />}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button color="error" onClick={onClose}>
          Cancel
        </Button>
        <Button disabled={isDisabled()} color="success" onClick={onAddExternEvent}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddEventModal
