import React, { useState } from "react"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import { useFormik } from "formik"
import {
  UserModelSchemaType,
  UserSettingsLabelSchema,
  UserSettingsType,
  UserSocialsSchemaType,
} from "../../schema/UserSchema"
import { toFormikValidate } from "zod-formik-adapter"
import { Box, Button, Divider, IconButton, List, ListItem, ListItemText, TextField, Typography } from "@mui/material"

import { HexColorPicker } from "react-colorful"
import { useCurrentUser } from "../../lib/hooks"
import { toast } from "react-toastify"
import { fetcher1 } from "../../lib/axiosFetcher"
import { FaTrash } from "react-icons/fa"

interface IProps {
  open: boolean
  handleClose: () => void
}

const AddLabelModal = ({ open, handleClose }: IProps) => {
  const [color, setColor] = useState("#b32aa9")
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const { data, mutate } = useCurrentUser()

  const addLabel = async () => {
    try {
      setIsLoading(true)

      interface Input {
        userSettings: UserSettingsType
      }

      const updatedUserSettings: UserSettingsType = {
        ...data?.payload?.userSettings,
        labels: [
          ...(data?.payload?.userSettings.labels || []),
          {
            name,
            color,
          },
        ],
      }

      const response = await fetcher1<UserModelSchemaType, Input>("/api/user", {
        headers: { "Content-Type": "application/json" },
        method: "PATCH",
        data: {
          userSettings: updatedUserSettings,
        },
      })
      if (response.error) {
        toast.error(response.error)
        setIsLoading(false)
      } else {
        console.log(response)
        mutate({ payload: response.payload }, false)
        setName("")
        toast.success("Label added")
        setIsLoading(false)
      }
    } catch (e) {
      console.error(e)
    }
  }

  const deleteLabel = async (name: string) => {
    try {
      setIsLoading(true)

      interface Input {
        userSettings: UserSettingsType
      }

      const updatedUserSettings: UserSettingsType = {
        ...data?.payload?.userSettings,
        labels: [...(data?.payload?.userSettings.labels || [])].filter((label) => label.name !== name),
      }

      const response = await fetcher1<UserModelSchemaType, Input>("/api/user", {
        headers: { "Content-Type": "application/json" },
        method: "PATCH",
        data: {
          userSettings: updatedUserSettings,
        },
      })
      if (response.error) {
        toast.error(response.error)
        setIsLoading(false)
      } else {
        console.log(response)
        mutate({ payload: response.payload }, false)
        setName("")
        toast.success("Label removed")
        setIsLoading(false)
      }
    } catch (e) {
      console.error(e)
    }
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
            onChange={(e) => setName(e.target.value)}
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
                  secondaryAction={
                    <IconButton onClick={() => deleteLabel(label.name)} color="error" edge="end" aria-label="delete">
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
          onClick={() => addLabel()}
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
