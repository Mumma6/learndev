import React, { useState } from "react"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import { pipe } from "fp-ts/function"
import * as A from "fp-ts/Array"
import * as O from "fp-ts/Option"
import * as TE from "fp-ts/TaskEither"
import { type UserModelSchemaType, type UserSettingsType } from "../../schema/UserSchema"
import { Box, Button, Divider, IconButton, List, ListItem, ListItemText, TextField } from "@mui/material"
import { HexColorPicker } from "react-colorful"
import { useCurrentUser } from "../../lib/hooks"
import { toast } from "react-toastify"
import { fetcherTE } from "../../lib/axiosFetcher"
import { FaTrash } from "react-icons/fa"

interface IProps {
  open: boolean
  handleClose: () => void
}

interface Input {
  userSettings: UserSettingsType
}

const AddLabelModal = ({ open, handleClose }: IProps) => {
  const [color, setColor] = useState("#b32aa9")
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const { data, mutate } = useCurrentUser()

  const onAddLabel = async () => {
    setIsLoading(true)
    pipe(
      fetcherTE<UserModelSchemaType, Input>("/api/user", {
        headers: { "Content-Type": "application/json" },
        method: "PATCH",
        data: {
          userSettings: pipe(
            data?.payload?.userSettings,
            O.fromNullable,
            O.map((settings) => ({
              ...settings,
              labels: [...(settings.labels || []), { name, color }]
            })),
            O.getOrElseW(() => ({ labels: [] }))
          )
        }
      }),
      TE.fold(
        (error) => {
          toast.error(error)
          setIsLoading(false)
          return TE.left(error)
        },
        (data) => {
          mutate({ payload: data.payload }, false)
          setName("")
          toast.success("Label added")
          setIsLoading(false)
          return TE.right(data)
        }
      )
    )()
  }

  const onDeleteLabel = async (name: string) => {
    setIsLoading(true)
    pipe(
      fetcherTE<UserModelSchemaType, Input>("/api/user", {
        headers: { "Content-Type": "application/json" },
        method: "PATCH",
        data: {
          userSettings: pipe(
            data?.payload?.userSettings,
            O.fromNullable,
            O.map((settings) => ({
              ...settings,
              labels: pipe(
                settings.labels,
                A.filter((label) => label.name !== name),
                (filteredLabels) => filteredLabels
              )
            })),
            O.getOrElseW(() => ({ labels: [] }))
          )
        }
      }),
      TE.fold(
        (error) => {
          toast.error(error)
          setIsLoading(false)
          return TE.left(error)
        },
        (response) => {
          mutate({ payload: response.payload }, false)
          setName("")
          toast.success("Label removed")
          setIsLoading(false)
          return TE.right(response)
        }
      )
    )()
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add label</DialogTitle>
      <DialogContent>
        <DialogContentText>Create labels to help you organize your studying.</DialogContentText>
        <Box>
          <TextField
            name="name"
            autoFocus
            margin="dense"
            id="name"
            label="Name"
            type="text"
            fullWidth
            sx={{ mb: 6 }}
            required
            variant="standard"
            onChange={(e) => { setName(e.target.value) }}
            value={name}
          />
          <Box sx={{ display: "flex", justifyContent: "space-around" }}>
            <HexColorPicker color={color} onChange={setColor} />
            <Box sx={{ height: 80, width: 80, borderRadius: 1 }} className="value" style={{ backgroundColor: color }}></Box>
          </Box>
          <Box>
            <List sx={{ marginTop: 3 }}>
              {data?.payload?.userSettings.labels.map((label) => (
                <ListItem
                  key={label.name}
                  secondaryAction={
                    <IconButton onClick={async () => { await onDeleteLabel(label.name) }} color="error" edge="end" aria-label="delete">
                      <FaTrash />
                    </IconButton>
                  }
                >
                  <Box
                    sx={{ height: 40, width: 40, borderRadius: 1, marginRight: 1 }}
                    className="value"
                    style={{ backgroundColor: label.color }}
                  ></Box>
                  <ListItemText primary={label.name} />
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ marginTop: 2 }}>
        <Button sx={{ marginRight: 2 }} variant="contained" color="error" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          onClick={async () => { await onAddLabel() }}
          disabled={name === "" || color === "" || isLoading}
          sx={{ marginRight: 2 }}
          variant="contained"
          color="success"
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddLabelModal
