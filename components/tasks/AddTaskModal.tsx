import React, { ChangeEvent, useState, useEffect } from "react"
import TextField from "@mui/material/TextField"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import Button from "@mui/material/Button"
import { SetState } from "../../types/generics"

interface IProps {
  open: boolean
  handleClose: SetState<void>
}

const AddTaskModal = ({ open, handleClose }: IProps) => {
  const onClose = () => {
    handleClose()
  }
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add task</DialogTitle>
      <DialogContent>
        <DialogContentText>Add a task or todo here</DialogContentText>
      </DialogContent>
    </Dialog>
  )
}

export default AddTaskModal
