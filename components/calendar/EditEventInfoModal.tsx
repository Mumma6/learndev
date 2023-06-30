
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import Button from "@mui/material/Button"
import { Box, Typography } from "@mui/material"
import { type ClickEventRet, type SetState } from "../../types/generics"
import { useRouter } from "next/router"
import { type IEventInfo } from "../../models/EventInfo"

interface IProps {
  open: boolean
  handleClose: SetState<void>
  onDeleteEvent: ClickEventRet<void>
  currentEvent: IEventInfo | null
}

const EditEventInfoModal = ({ open, handleClose, onDeleteEvent, currentEvent }: IProps) => {
  const router = useRouter()
  const onClose = () => {
    handleClose()
  }
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Event Info</DialogTitle>

      <DialogContent>
        {currentEvent?.activityId && (
          <Button
            variant="outlined"
            sx={{ width: "100%", marginBottom: 2, marginTop: 2 }}
            onClick={async () => await router.push(`/${currentEvent.activityGroup?.toLocaleLowerCase()}/${currentEvent?.activityId}`)}
          >
            <Typography variant="body2">Go to: {currentEvent.activityName}</Typography>
          </Button>
        )}
        <DialogContentText>
          <Typography variant="h4" component="div">
            {currentEvent?.title}
          </Typography>
          <Typography sx={{ fontSize: 14, marginTop: 3 }} color="text.secondary" gutterBottom>
            {currentEvent?.description}
          </Typography>
        </DialogContentText>
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
