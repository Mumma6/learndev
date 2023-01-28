import React, { ChangeEvent, useState, useEffect } from "react"
import TextField from "@mui/material/TextField"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import Button from "@mui/material/Button"
import {
  Box,
  Divider,
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
import { useCourses } from "../../lib/hooks"

interface IProps {
  open: boolean
  handleClose: SetState<void>
  externEventFormData: ExternEventFormData
  setExternEventFormData: SetState<ExternEventFormData>
  onAddExternEvent: ClickEventRet<void>
}

interface CourseData {
  id: string | undefined
  name: string
}

const AddEventModal = ({
  open,
  handleClose,
  externEventFormData,
  setExternEventFormData,
  onAddExternEvent,
}: IProps) => {
  // detta är en copy paste i båda modalerna, gör en customHook
  const [courses, setCourses] = useState<CourseData[]>([])

  const { data: courseData } = useCourses()

  useEffect(() => {
    if (courseData?.payload) {
      setCourses([
        ...(courseData?.payload || [])
          .filter((c) => !c.completed)
          .map((course) => ({
            id: course._id?.toString(),
            name: course.content.title.toString(),
          })),
      ])
    }
  }, [courseData?.payload])

  // ---------------------------

  const { title, description, start, end, allDay, color, courseId } = externEventFormData

  const onClose = () => {
    handleClose()
  }

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setExternEventFormData((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }))
  }

  const handleSelectChange = (event: SelectChangeEvent) => {
    setExternEventFormData((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }))
  }

  const handleSelectCourseChange = (event: SelectChangeEvent) => {
    setExternEventFormData((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
      courseName:
        (courseData?.payload || []).find((c) => c._id?.toString() === event.target.value)?.content
          .title || null,
    }))
  }

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    setExternEventFormData((prevState) => ({
      ...prevState,
      allDay: event.target.checked,
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
              <Typography variant="caption" color="text">
                All day?
              </Typography>
              <Checkbox onChange={handleCheckboxChange} value={allDay} />
            </Box>

            <DateTimePicker
              label="End date"
              disabled={allDay}
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
          <FormControl fullWidth style={{ marginTop: 10 }}>
            <InputLabel id="demo-simple-select-label">Color</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={color}
              label="Color"
              onChange={handleSelectChange}
              name="color"
            >
              <MenuItem style={{ color: "white", backgroundColor: "red" }} value={"red"}>
                red
              </MenuItem>
              <MenuItem style={{ color: "white", backgroundColor: "green" }} value={"green"}>
                green
              </MenuItem>
              <MenuItem style={{ color: "white", backgroundColor: "blue" }} value={"blue"}>
                blue
              </MenuItem>
            </Select>
          </FormControl>
          {!!courses.length && (
            <FormControl fullWidth style={{ marginTop: 15 }}>
              <InputLabel id="demo-simple-select-label">Link course</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={courseId || undefined}
                label="Course"
                onChange={handleSelectCourseChange}
                name="courseId"
              >
                {courses.map((course) => (
                  <MenuItem value={course.id}>{course.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
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
