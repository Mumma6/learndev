import React from "react"
import { Alert, Box, Card, CardContent, CardHeader, Divider } from "@mui/material"
import { pipe } from "fp-ts/function"
import * as TE from "fp-ts/TaskEither"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import { toast } from "react-toastify"
import { fetcherTE } from "../../lib/axiosFetcher"
import { useRouter } from "next/router"
import { useCurrentUser } from "../../lib/hooks"

const DeleteAccount = () => {
  const [isLoading, setIsLoading] = React.useState(false)
  const [open, setOpen] = React.useState(false)
  const router = useRouter()
  const { mutate } = useCurrentUser()

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleDelete = async () => {
    pipe(
      fetcherTE("/api/user", {
        method: "DELETE"
      }),
      TE.fold(
        (error) => {
          setIsLoading(false)
          handleClose()
          toast.error(error)
          return TE.left(error)
        },
        (data) => {
          setIsLoading(false)
          handleClose()
          mutate({ payload: null })
          toast.success(data.message)
          router.replace("/")
          return TE.right(data)
        }
      )
    )()
  }

  return (
    <Card>
      <CardHeader subheader="Delete your account" title="Delete" />
      <Divider />
      <CardContent sx={{ minHeight: 242 }}>
        <Alert severity="error">This will delete your account permanently</Alert>
      </CardContent>
      <Divider />
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          p: 2
        }}
      >
        <div>
          <Button variant="contained" color="error" onClick={handleClickOpen}>
            Delete
          </Button>
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{"Are you sure you want to delete your account?"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">Deleted accounts can never be restored.</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button disabled={isLoading} color="info" onClick={handleClose}>
                Disagree
              </Button>
              <Button disabled={isLoading} color="error" onClick={handleDelete}>
                Agree
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </Box>
    </Card>
  )
}

export default DeleteAccount
