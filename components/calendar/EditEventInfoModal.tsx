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

interface IProps {
  open: boolean
  handleClose: SetState<void>
  onDeleteEvent: ClickEventRet<void>
}

/*  
 Should be able to toggle Events as "completed" "started" "not done". Should give the student a overview of what has been accomplished
*/

const EditEventInfoModal = ({ open, handleClose, onDeleteEvent }: IProps) => {
  const onClose = () => {
    handleClose()
  }
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Event</DialogTitle>
      <DialogContent>
        <DialogContentText>Delete your event here</DialogContentText>
        <Box component="form"></Box>
      </DialogContent>
      <DialogActions>
        <Button color="error" onClick={onClose}>
          Cancel
        </Button>
        <Button color="info" onClick={onDeleteEvent}>
          Delete Event
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditEventInfoModal
