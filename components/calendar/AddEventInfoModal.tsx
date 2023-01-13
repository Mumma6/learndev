import { ChangeEvent, useCallback, useState } from "react"

import TextField from "@mui/material/TextField"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import Button from "@mui/material/Button"
import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material"
import { ClickEventRet, SetState } from "../../types/generics"
import { EventFormData, initialEventFormState } from "./StudyCalendar"
import { Event } from "react-big-calendar"

interface IProps {
  open: boolean
  handleClose: SetState<void>
  eventFormData: EventFormData
  setEventFormData: SetState<EventFormData>
  onAddEvent: ClickEventRet<void>
  currentEvent: Event | null
}

const AddEventInfoModal = ({
  open,
  handleClose,
  eventFormData,
  setEventFormData,
  onAddEvent,
}: IProps) => {
  const { title, description } = eventFormData

  const onClose = () => {
    setEventFormData(initialEventFormState)
    handleClose()
  }

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEventFormData((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }))
  }
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add event</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To add a course, please fill in the information below.
        </DialogContentText>
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
        </Box>
      </DialogContent>
      <DialogActions>
        <Button color="error" onClick={onClose}>
          Cancel
        </Button>
        <Button color="success" onClick={onAddEvent}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddEventInfoModal

/*

Kunna välja kurs eller quiz

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

*/
