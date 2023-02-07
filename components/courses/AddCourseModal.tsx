import { ChangeEvent, useCallback, useState } from "react"

import TextField from "@mui/material/TextField"
import Checkbox from "@mui/material/Checkbox"
import Chip from "@mui/material/Chip"
import Paper from "@mui/material/Paper"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import Button from "@mui/material/Button"
import FormControlLabel from "@mui/material/FormControlLabel"
import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material"
import Autocomplete from "@mui/material/Autocomplete"

import { initialCourseFormState } from "./Courses"
import { ClickEventRet, SetState } from "../../types/generics"
import { skillsData } from "../../constants/skillsData"
import { FaPlus } from "react-icons/fa"
import { SkillSchemaType } from "../../schema/SharedSchema"
import { CourseModelContentInputSchemaType, InstitutionEnum } from "../../schema/CourseSchema"

interface IProps {
  open: boolean
  handleClose: SetState<void>
  courseFormData: CourseModelContentInputSchemaType
  topicData: SkillSchemaType[]
  setCourseFormData: SetState<CourseModelContentInputSchemaType>
  setTopicData: SetState<SkillSchemaType[]>
  setCompleted: SetState<boolean>
  completed: boolean
  onAddCourse: ClickEventRet<Promise<void>>
}

const AddCourseModal = ({
  open,
  handleClose,
  courseFormData,
  setCourseFormData,
  onAddCourse,
  setCompleted,
  completed,
  setTopicData,
  topicData,
}: IProps) => {
  const { title, description, institution, url } = courseFormData

  const [newSkill, setNewSkill] = useState<SkillSchemaType | null>()

  const addNewskill = () => {
    if (newSkill) {
      setTopicData((data) => [...data, newSkill])
      setNewSkill(null)
    }
  }
  const handleCheckBoxChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCompleted(event.target.checked)
  }

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCourseFormData((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }))
  }

  const handleSelectChange = (event: SelectChangeEvent) => {
    setCourseFormData((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }))
  }

  const onClose = () => {
    setCourseFormData(initialCourseFormState)
    handleClose()
  }

  const handleSkillChange = (e: React.SyntheticEvent, value: SkillSchemaType | null) => {
    setNewSkill(value)
  }

  const handleTopicDelete = (topicToDelete: SkillSchemaType) => () => {
    setTopicData((topics) => topics.filter((topic) => topic.label !== topicToDelete.label))
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add course</DialogTitle>
      <DialogContent>
        <DialogContentText>To add a course, please fill in the information below.</DialogContentText>
        <FormControlLabel
          control={
            <Checkbox checked={completed} onChange={handleCheckBoxChange} inputProps={{ "aria-label": "controlled" }} />
          }
          label="Course completed"
        />
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
            sx={{ mb: 2 }}
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
            sx={{ mb: 2 }}
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
            sx={{ mb: 2 }}
          />
          <Box
            sx={{
              display: "flex",
              justifyContent: "start",
              flexWrap: "wrap",
              listStyle: "none",
            }}
          >
            <Autocomplete
              onChange={handleSkillChange}
              disablePortal
              id="combo-box-demo"
              options={skillsData}
              sx={{ width: 400, marginRight: 3 }}
              renderInput={(params) => <TextField {...params} label="Topics" />}
            />
            <Button onClick={addNewskill} style={{ fontSize: 20 }}>
              <FaPlus />
            </Button>
            {!!topicData.length && (
              <Box>
                <Paper
                  sx={{
                    display: "flex",
                    justifyContent: "start",
                    flexWrap: "wrap",
                    listStyle: "none",
                    p: 1.5,
                    mt: 3,
                  }}
                  component="ul"
                >
                  {topicData.map((data) => (
                    <Chip key={data.label} color="primary" label={data.label} onDelete={handleTopicDelete(data)} />
                  ))}
                </Paper>
              </Box>
            )}
          </Box>

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
              <MenuItem value={InstitutionEnum.Enum.Other}>Other</MenuItem>
              <MenuItem value={InstitutionEnum.Enum.Udemy}>Udemy</MenuItem>
              <MenuItem value={InstitutionEnum.Enum.Linkedin}>Linkedin</MenuItem>
              <MenuItem value={InstitutionEnum.Enum.Pluralsight}>Pluralsight</MenuItem>
              <MenuItem value={InstitutionEnum.Enum.Youtube}>Youtube</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button color="error" onClick={onClose}>
          Cancel
        </Button>
        <Button color="success" onClick={onAddCourse}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddCourseModal
