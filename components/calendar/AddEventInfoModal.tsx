import { type ChangeEvent, useEffect, useState } from "react"

import TextField from "@mui/material/TextField"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import Button from "@mui/material/Button"
import { Autocomplete, Box } from "@mui/material"
import { type ClickEventRet, type SetState } from "../../types/generics"
import { type EventFormData, initialEventFormState } from "./StudyCalendar"
import { type Event } from "react-big-calendar"
import { type ActivitesData, getCourses, getProjects, getQuizzes } from "./calendarUtils"
import { useCourses, useCurrentUser, useProjects, useQuizzes } from "../../lib/hooks"
import { type UserSettingsLabelType } from "../../schema/UserSchema"

interface IProps {
  open: boolean
  handleClose: SetState<void>
  eventFormData: EventFormData
  setEventFormData: SetState<EventFormData>
  onAddEvent: ClickEventRet<void>
  currentEvent: Event | null
  labels: UserSettingsLabelType[]
}

const AddEventInfoModal = ({ open, handleClose, eventFormData, setEventFormData, onAddEvent, labels }: IProps) => {
  const { title, description } = eventFormData

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
        ...getQuizzes(quizzData.payload, userData?.payload?.completedQuizzes as string[])
      ])
    }
  }, [courseData?.payload, projectData?.payload, quizzData?.payload])

  // ---------------------------------

  const onClose = () => {
    setEventFormData(initialEventFormState)
    handleClose()
  }

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEventFormData((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value
    }))
  }

  const handleActivityChange = (e: React.SyntheticEvent, value: ActivitesData | null) => {
    setEventFormData((prevState) => ({
      ...prevState,
      activityName: value?.name,
      activityId: value?.id,
      activityGroup: value?.group
    }))
  }

  const handleLabelChange = (e: React.SyntheticEvent, value: UserSettingsLabelType | null) => {
    setEventFormData((prevState) => ({
      ...prevState,
      labelColor: value?.color,
      labelName: value?.name
    }))
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
        <Button disabled={title === "" || description === ""} color="success" onClick={onAddEvent}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddEventInfoModal
