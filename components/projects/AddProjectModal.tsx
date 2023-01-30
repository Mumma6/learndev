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

import { ClickEvent, ClickEventRet, SetState } from "../../types/generics"
import { Skill, skillsData } from "../../constants/skillsData"
import { FaPlus } from "react-icons/fa"
import { initialProjectsFormData, ProjectsFormData } from "./Projects"

interface IProps {
  open: boolean
  handleClose: SetState<void>
  projectFormData: ProjectsFormData
  topicData: Skill[]
  setProjectFormData: SetState<ProjectsFormData>
  setTopicData: SetState<Skill[]>
  setCompleted: SetState<boolean>
  completed: boolean
  onAddProject: ClickEventRet<Promise<void>>
}

const AddProjectModal = ({
  open,
  handleClose,
  projectFormData,
  setCompleted,
  setProjectFormData,
  setTopicData,
  topicData,
  onAddProject,
  completed,
}: IProps) => {
  const { title, shortDescription, deployedUrl, sourceCodeUrl, description } = projectFormData

  // gör till en customHook, samma sak i AddCourseModal
  const [newSkill, setNewSkill] = useState<Skill | null>(null)

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
    setProjectFormData((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }))
  }

  const onClose = () => {
    setProjectFormData(initialProjectsFormData)
    handleClose()
  }

  const handleSkillChange = (e: React.SyntheticEvent, value: Skill | null) => {
    setNewSkill(value)
  }

  const handleTopicDelete = (topicToDelete: Skill) => () => {
    setTopicData((topics) => topics.filter((topic) => topic.label !== topicToDelete.label))
  }

  const addProject = (event: ClickEvent) => {
    setNewSkill(null)
    onAddProject(event)
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add project</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To add a project, please fill in the information below. More information can be added
          later.
        </DialogContentText>
        <FormControlLabel
          control={
            <Checkbox
              checked={completed}
              onChange={handleCheckBoxChange}
              inputProps={{ "aria-label": "controlled" }}
            />
          }
          label="Project completed"
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
            required
          />
          <TextField
            name="shortDescription"
            required
            value={shortDescription}
            margin="dense"
            id="description"
            label="Short description"
            type="text"
            fullWidth
            variant="standard"
            onChange={onChange}
            helperText={`${shortDescription.length}/${30}`}
            sx={{ mb: 2 }}
            inputProps={{
              maxlength: 30,
            }}
          />
          <TextField
            name="description"
            value={description}
            required
            multiline
            rows={3}
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
            name="deployedUrl"
            value={deployedUrl}
            margin="dense"
            id="url"
            label="Link to site"
            type="text"
            fullWidth
            variant="standard"
            onChange={onChange}
            sx={{ mb: 2 }}
          />
          <TextField
            name="sourceCodeUrl"
            value={sourceCodeUrl}
            margin="dense"
            id="url"
            label="Source code link"
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
              renderInput={(params) => <TextField {...params} label="Tech stack" />}
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
                    <Chip
                      key={data.label}
                      color="primary"
                      label={data.label}
                      onDelete={handleTopicDelete(data)}
                    />
                  ))}
                </Paper>
              </Box>
            )}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button color="error" onClick={onClose}>
          Cancel
        </Button>
        <Button color="success" onClick={addProject}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddProjectModal
