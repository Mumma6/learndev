import { ChangeEvent, useCallback, useState } from "react"

import TextField from "@mui/material/TextField"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import Button from "@mui/material/Button"
import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material"

import { CourseFormData, initialCourseFormState, Institution } from "./Courses"
import { ClickEventRet, SetState } from "../../types/generics"

interface IProps {
  open: boolean
  handleClose: SetState<void>
  courseFormData: CourseFormData
  setCourseFormData: SetState<CourseFormData>
  onAddCourse: ClickEventRet<Promise<void>>
}

const AddCourseModal = ({ open, handleClose, courseFormData, setCourseFormData, onAddCourse }: IProps) => {
  const { title, description, institution, url } = courseFormData

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCourseFormData((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }))
  }

  const handleSelectChange = (event: SelectChangeEvent) => {
    setCourseFormData((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }))
  }

  const onClose = () => {
    setCourseFormData(initialCourseFormState)
    handleClose()
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add course</DialogTitle>
      <DialogContent>
        <DialogContentText>To add a course, please fill in the information below.</DialogContentText>
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
          <TextField
            name="url"
            value={url}
            margin="dense"
            id="url"
            label="Url"
            type="text"
            fullWidth
            variant="standard"
            onChange={onChange}
          />
          <FormControl fullWidth style={{ marginTop: 20 }}>
            <InputLabel id="demo-simple-select-label">institution</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={institution}
              label="institution"
              name="institution"
              onChange={handleSelectChange}
            >
              <MenuItem value={Institution.Other}>Other</MenuItem>
              <MenuItem value={Institution.Udemy}>Udemy</MenuItem>
              <MenuItem value={Institution.Pluralsight}>Pluralsight</MenuItem>
              <MenuItem value={Institution.Youtube}>Youtube</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button color="error" onClick={onClose}>
          Cancel
        </Button>
        <Button color="success" onClick={onAddCourse}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddCourseModal
