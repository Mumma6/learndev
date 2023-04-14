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

import { initialFormState } from "./Workexperience"

// Ersätt dayjs med date-fns
import dayjs, { Dayjs } from "dayjs"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import Typography from "@mui/material/Typography"
import { UserWorkexperienceSchema, UserWorkexperienceSchemaType } from "../../schema/UserSchema"
import { IZodFormValidation } from "zod-react-form"

interface IProps {
  open: boolean
  handleClose: SetState<void>
  formValues: UserWorkexperienceSchemaType
  setFieldValue: (key: keyof UserWorkexperienceSchemaType, value: string | boolean) => void
  errors: IZodFormValidation<UserWorkexperienceSchemaType>["errors"]
  onAddWorkexperience: () => void
  onBlur: (key: keyof UserWorkexperienceSchemaType) => void
  touched: IZodFormValidation<UserWorkexperienceSchemaType>["touched"]
}

const WorkexperienceModal = ({
  open,
  handleClose,
  formValues,
  setFieldValue,
  onAddWorkexperience,
  errors,
  touched,
  onBlur,
}: IProps) => {
  const { role, startDate, endDate, company, currentJob, description } = formValues

  const onAdd = () => {
    onAddWorkexperience()
  }

  const onClose = () => {
    handleClose()
  }

  const onChange = (key: string, value: string | boolean) => {
    setFieldValue(key as keyof UserWorkexperienceSchemaType, value)
  }

  const isDisabled = () => {
    const checkEndDate = () => {
      if (currentJob !== true && endDate === "") {
        return true
      }
    }
    if (role === "" || company === "" || description === "" || startDate === "" || checkEndDate()) {
      return true
    }
    return false
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add work experience</DialogTitle>
      <DialogContent>
        <DialogContentText>To add a work experience, please fill in the information below.</DialogContentText>
        <Box component="form" mt={2}>
          <TextField
            name="role"
            value={role}
            onChange={(e) => onChange(e.target.name, e.target.value)}
            autoFocus
            margin="dense"
            id="name"
            label="Role"
            type="text"
            fullWidth
            onBlur={() => onBlur("role")}
            helperText={(touched.role && errors.role) || " "}
            error={Boolean(touched.role && errors.role)}
          />
          <TextField
            name="company"
            margin="dense"
            id="name"
            label="Company"
            type="text"
            fullWidth
            value={company}
            onBlur={() => onBlur("company")}
            onChange={(e) => onChange(e.target.name, e.target.value)}
            helperText={(touched.company && errors.company) || " "}
            error={Boolean(touched.company && errors.company)}
          />
          <TextField
            multiline
            rows={7}
            name="description"
            margin="dense"
            id="description"
            label="Description"
            type="text"
            fullWidth
            value={description}
            onBlur={() => onBlur("description")}
            onChange={(e) => onChange(e.target.name, e.target.value)}
            helperText={(touched.description && errors.description) || " "}
            error={Boolean(touched.description && errors.description)}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box mb={2} mt={5}>
              <DatePicker
                label="Start date"
                value={startDate}
                onChange={(newValue) => {
                  onChange("startDate", dayjs(newValue).format("YYYY-MM-DD"))
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </Box>

            <Box>
              <Typography variant="caption" color="text">
                Current job?
              </Typography>
              <Checkbox name="currentJob" onChange={(e) => onChange(e.target.name, e.target.checked)} value={currentJob} />
            </Box>

            <DatePicker
              label="End date"
              disabled={currentJob}
              value={endDate || null}
              onChange={(newValue) => {
                onChange("endDate", dayjs(newValue).format("YYYY-MM-DD"))
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
        <Button disabled={isDisabled()} color="success" onClick={onAdd}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default WorkexperienceModal
