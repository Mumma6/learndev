import { ChangeEvent, useCallback, useState } from "react"
import TextField from "@mui/material/TextField"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import Button from "@mui/material/Button"
import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material"
import { fetcher } from "../../lib/fetcher"
import { toast } from "react-toastify"
import { useCourses } from "../../lib/hooks"

interface IProps {
  open: boolean
  handleClose: () => void
}

enum Institution {
  Udemy = "Udemy",
  Youtube = "Youtube",
  Pluralsight = "Pluralsight",
  Other = "Other",
}

interface FormData {
  title: string
  description: string
  institution: Institution
  url: string
}

const initialState: FormData = {
  title: "",
  description: "",
  institution: Institution.Other,
  url: "",
}

const AddCourseModal = ({ open, handleClose }: IProps) => {
  const [formData, setFormData] = useState<FormData>(initialState)
  const [isLoading, setIsLoading] = useState(false)

  const { title, description, institution, url } = formData

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFormData((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }))
  }

  const handleSelectChange = (event: SelectChangeEvent) => {
    setFormData((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }))
  }

  const onSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault()
    try {
      setIsLoading(true)
      const response = await fetcher("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: formData,
        }),
      })

      if (response.error) {
        toast.error(response.error.message)
      } else {
        toast.success("Course added")
      }
    } catch (e: any) {
      console.log(e)
    } finally {
      setFormData(initialState)
      setIsLoading(false)
    }
  }

  const onClose = () => {
    setFormData(initialState)
    handleClose()
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add course</DialogTitle>
      <DialogContent>
        <DialogContentText>To add a course, please fill in the information below.</DialogContentText>
        <Box component="form">
          <TextField
            name="title"
            value={title}
            autoFocus
            margin="dense"
            id="name"
            label="Title"
            type="text"
            fullWidth
            variant="standard"
            onChange={onChange}
          />
          <TextField
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
          <TextField
            name="url"
            value={url}
            margin="dense"
            id="url"
            label="Url"
            type="text"
            fullWidth
            variant="standard"
            onChange={onChange}
          />
          <FormControl fullWidth style={{ marginTop: 20 }}>
            <InputLabel id="demo-simple-select-label">institution</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={institution}
              label="institution"
              name="institution"
              onChange={handleSelectChange}
            >
              <MenuItem value={Institution.Other}>Other</MenuItem>
              <MenuItem value={Institution.Udemy}>Udemy</MenuItem>
              <MenuItem value={Institution.Pluralsight}>Pluralsight</MenuItem>
              <MenuItem value={Institution.Youtube}>Youtube</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button color="error" onClick={onClose}>
          Cancel
        </Button>
        <Button color="success" onClick={onSubmit}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddCourseModal
