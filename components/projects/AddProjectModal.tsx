import { ChangeEvent, useCallback, useState } from "react"

import TextField from "@mui/material/TextField"
import Chip from "@mui/material/Chip"
import Paper from "@mui/material/Paper"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import Button from "@mui/material/Button"
import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material"
import Autocomplete from "@mui/material/Autocomplete"

import { ClickEvent, ClickEventRet, SetState } from "../../types/generics"
import { Skill, skillsData } from "../../constants/skillsData"
import { FaPlus } from "react-icons/fa"
import { initialProjectsFormData } from "./Projects"
import { ProjectModelFromInputType, ProjectStatusEnum } from "../../schema/ProjectSchema"
import { IZodFormValidation } from "../customHooks/useZodFormValidation"

interface IProps {
  open: boolean
  handleClose: SetState<void>
  topicData: Skill[]
  setTopicData: SetState<Skill[]>

  onAddProject: ClickEventRet<Promise<void>>
  zodForm: IZodFormValidation<Omit<ProjectModelFromInputType, "techStack" | "completed">>
}

const AddProjectModal = ({ open, handleClose, setTopicData, topicData, onAddProject, zodForm }: IProps) => {
  const { title, deployedUrl, sourceCodeUrl, description, status } = zodForm.values

  // gör till en customHook, samma sak i AddCourseModal
  const [newSkill, setNewSkill] = useState<Skill | null>(null)

  const addNewskill = () => {
    if (newSkill) {
      setTopicData((data) => [...data, newSkill])
      setNewSkill(null)
    }
  }

  const onChange = (key: string, value: unknown) => {
    zodForm.setFieldValue(key as keyof Omit<ProjectModelFromInputType, "techStack" | "completed">, value)
  }

  const onClose = () => {
    handleClose()
  }

  const handleSkillChange = (e: React.SyntheticEvent, value: Skill | null) => {
    setNewSkill(value)
  }

  const handleTopicDelete = (topicToDelete: Skill) => () => {
    setTopicData((topics) => topics.filter((topic) => topic.label !== topicToDelete.label))
  }

  // Kolla så inte detta blir någon konstig re-render
  const addProject = (event: ClickEvent) => {
    setNewSkill(null)
    onAddProject(event)
  }

  const isDisabled = () => {
    const hasTopics = () => !topicData.length

    return zodForm.isDisabled(hasTopics)
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add project</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To add a project, please fill in the information below. More information can be added later.
        </DialogContentText>

        <Box component="form">
          <TextField
            name="title"
            inputProps={{ maxLength: 100 }}
            value={title}
            autoFocus
            margin="dense"
            id="name"
            label="Title"
            type="text"
            fullWidth
            onChange={(e) => onChange(e.target.name, e.target.value)}
            onBlur={() => zodForm.onBlur("title")}
            helperText={(zodForm.touched.title && zodForm.errors.title) || " "}
            error={Boolean(zodForm.touched.title && zodForm.errors.title)}
          />
          <TextField
            name="description"
            value={description}
            multiline
            rows={7}
            margin="dense"
            id="description"
            label="Description"
            inputProps={{ maxLength: 1500 }}
            type="text"
            fullWidth
            onChange={(e) => onChange(e.target.name, e.target.value)}
            onBlur={() => zodForm.onBlur("description")}
            helperText={(zodForm.touched.description && zodForm.errors.description) || " "}
            error={Boolean(zodForm.touched.description && zodForm.errors.description)}
          />
          <TextField
            name="deployedUrl"
            value={deployedUrl}
            margin="dense"
            id="url"
            label="Link to site"
            type="text"
            fullWidth
            onChange={(e) => onChange(e.target.name, e.target.value)}
            onBlur={() => zodForm.onBlur("deployedUrl")}
            helperText={(zodForm.touched.deployedUrl && zodForm.errors.deployedUrl) || " "}
            error={Boolean(zodForm.touched.deployedUrl && zodForm.errors.deployedUrl)}
          />
          <TextField
            name="sourceCodeUrl"
            value={sourceCodeUrl}
            margin="dense"
            id="url"
            label="Source code link"
            type="text"
            fullWidth
            onChange={(e) => onChange(e.target.name, e.target.value)}
            onBlur={() => zodForm.onBlur("sourceCodeUrl")}
            helperText={(zodForm.touched.sourceCodeUrl && zodForm.errors.sourceCodeUrl) || " "}
            error={Boolean(zodForm.touched.sourceCodeUrl && zodForm.errors.sourceCodeUrl)}
          />

          <FormControl fullWidth style={{ marginTop: 20, marginBottom: 20 }}>
            <InputLabel>Project status</InputLabel>
            <Select
              value={status}
              label="Project status"
              name="status"
              onChange={(e) => zodForm.setFieldValue("status", e.target.value)}
              onBlur={() => zodForm.onBlur("status")}
              error={Boolean(zodForm.touched.status && zodForm.errors.status)}
            >
              <MenuItem value={ProjectStatusEnum.Enum.Done}>Done</MenuItem>
              <MenuItem value={ProjectStatusEnum.Enum["In progress"]}>In progress</MenuItem>
              <MenuItem value={ProjectStatusEnum.Enum.Planning}>Planning</MenuItem>
            </Select>
          </FormControl>
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
              sx={{ width: 450, marginRight: 2 }}
              renderInput={(params) => <TextField {...params} label="Tech stack" />}
            />
            <Button disabled={!newSkill} onClick={addNewskill} style={{ fontSize: 20 }}>
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
        </Box>
      </DialogContent>
      <DialogActions>
        <Button color="error" onClick={onClose}>
          Cancel
        </Button>
        <Button disabled={isDisabled()} color="success" onClick={addProject}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddProjectModal
