import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import Button from "@mui/material/Button"

import React from "react"
import { TaskModelType } from "../../schema/TaskSchema"

interface IProps {
  task: TaskModelType | undefined
  open: boolean
  handleClose: () => void
}
export const TaskInfoModal = ({ task, open, handleClose }: IProps) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{task?.title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{task?.description}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button color="info" onClick={handleClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}
