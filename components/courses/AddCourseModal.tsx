import React from "react"
import TextField from "@mui/material/TextField"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import Button from "@mui/material/Button"

interface IProps {
  open: boolean
  handleClose: () => void
}

const AddCourseModal = ({ open, handleClose }: IProps) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add course</DialogTitle>
      <DialogContent>
        <DialogContentText>To add a course, please fill in the information below.</DialogContentText>
        <TextField autoFocus margin="dense" id="name" label="Title" type="text" fullWidth variant="standard" />
        <TextField margin="dense" id="name" label="Description" type="text" fullWidth variant="standard" />
        <TextField margin="dense" id="name" label="From" type="text" fullWidth variant="standard" />
        <TextField margin="dense" id="name" label="Link" type="text" fullWidth variant="standard" />
      </DialogContent>
      <DialogActions>
        <Button color="error" onClick={handleClose}>
          Cancel
        </Button>
        <Button color="success" onClick={handleClose}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddCourseModal
