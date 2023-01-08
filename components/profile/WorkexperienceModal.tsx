import React, { ChangeEvent } from "react"
import TextField from "@mui/material/TextField"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import Button from "@mui/material/Button"
import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material"
import Checkbox from "@mui/material/Checkbox"

import { ClickEventRet, SetState } from "../../types/generics"
import { Workexperience } from "../../types/user"
import { initialFormState } from "./Workexperience"

// Ersätt dayjs med date-fns
import dayjs, { Dayjs } from "dayjs"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import Typography from "@mui/material/Typography"

interface IProps {
  open: boolean
  handleClose: SetState<void>
  workexperienceFormData: Workexperience
  setWorkexperienceFormData: SetState<Workexperience>
  onAddWorkexperience: ClickEventRet<void>
}

const WorkexperienceModal = ({
  open,
  handleClose,
  workexperienceFormData,
  setWorkexperienceFormData,
  onAddWorkexperience,
}: IProps) => {
  const { role, startDate, endDate, company, currentJob, description } = workexperienceFormData

  const onClose = () => {
    setWorkexperienceFormData(initialFormState)
    handleClose()
  }

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setWorkexperienceFormData((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }))
  }

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    setWorkexperienceFormData((prevState) => ({
      ...prevState,
      currentJob: event.target.checked,
    }))
  }

  const isDisabled = () => {
    const checkEndDate = () => {
      if (currentJob !== true && endDate === null) {
        return true
      }
    }
    if (role === "" || company === "" || description === "" || startDate === null || checkEndDate()) {
      return true
    }
    return false
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add work experience</DialogTitle>
      <DialogContent>
        <DialogContentText>To add a work experience, please fill in the information below.</DialogContentText>
        <Box component="form">
          <TextField
            name="role"
            value={role}
            autoFocus
            margin="dense"
            id="name"
            label="Role"
            type="text"
            fullWidth
            variant="standard"
            onChange={onChange}
          />
          <TextField
            name="company"
            value={company}
            margin="dense"
            id="name"
            label="Company"
            type="text"
            fullWidth
            variant="standard"
            onChange={onChange}
          />
          <TextField
            multiline
            rows={3}
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
              <DatePicker
                label="Start date"
                value={startDate}
                onChange={(newValue) => {
                  setWorkexperienceFormData((prevState) => ({
                    ...prevState,
                    startDate: dayjs(newValue).format("YYYY-MM-DD"),
                  }))
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </Box>

            <Box>
              <Typography variant="caption" color="text">
                Current job?
              </Typography>
              <Checkbox onChange={handleCheckboxChange} value={currentJob} />
            </Box>

            <DatePicker
              label="End date"
              disabled={currentJob}
              value={endDate}
              onChange={(newValue) => {
                setWorkexperienceFormData((prevState) => ({
                  ...prevState,
                  endDate: dayjs(newValue).format("YYYY-MM-DD"),
                }))
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button color="error" onClick={onClose}>
          Cancel
        </Button>
        <Button disabled={isDisabled()} color="success" onClick={onAddWorkexperience}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default WorkexperienceModal
