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
import { Box, Divider, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material"
import Autocomplete from "@mui/material/Autocomplete"

import { initialCourseFormState } from "./Courses"
import { ClickEventRet, SetState } from "../../types/generics"
import { skillsData } from "../../constants/skillsData"
import { FaPlus } from "react-icons/fa"
import { SkillSchemaType } from "../../schema/SharedSchema"
import { CourseModelContentInputSchemaType, InstitutionEnum } from "../../schema/CourseSchema"
import { ErrorsType, TouchedType } from "../customHooks/useZodFormValidation"

interface IProps {
  open: boolean
  handleClose: SetState<void>
  formValues: CourseModelContentInputSchemaType
  topicData: SkillSchemaType[]
  setTopicData: SetState<SkillSchemaType[]>
  setCompleted: SetState<boolean>
  completed: boolean
  onAddCourse: ClickEventRet<Promise<void>>

  setFieldValue: (key: keyof CourseModelContentInputSchemaType, value: unknown) => void
  errors: ErrorsType<CourseModelContentInputSchemaType>

  onBlur: (key: keyof CourseModelContentInputSchemaType) => void
  touched: TouchedType<CourseModelContentInputSchemaType>
}

const AddCourseModal = ({
  open,
  handleClose,
  formValues,
  onAddCourse,
  setCompleted,
  completed,
  setTopicData,
  topicData,
  setFieldValue,
  onBlur,
  touched,
  errors,
}: IProps) => {
  const { title, description, institution, url, certificateUrl } = formValues

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

  const onChange = (key: string, value: unknown) => {
    setFieldValue(key as keyof CourseModelContentInputSchemaType, value)
  }

  const onClose = () => {
    handleClose()
  }

  const handleSkillChange = (e: React.SyntheticEvent, value: SkillSchemaType | null) => {
    setNewSkill(value)
  }

  const handleTopicDelete = (topicToDelete: SkillSchemaType) => () => {
    setTopicData((topics) => topics.filter((topic) => topic.label !== topicToDelete.label))
  }

  const isDisabled = () => {
    const formErrors = Object.values(errors).some((error) => error)
    console.log(formErrors)

    if (formErrors || !topicData.length) {
      return true
    }

    return false
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add course</DialogTitle>
      <DialogContent>
        <DialogContentText>To add a course, please fill in the information below.</DialogContentText>

        <Box component="form" mt={4}>
          <TextField
            name="title"
            value={title}
            inputProps={{ maxLength: 100 }}
            autoFocus
            margin="dense"
            id="name"
            label="Title"
            type="text"
            fullWidth
            onChange={(e) => onChange(e.target.name, e.target.value)}
            onBlur={() => onBlur("title")}
            helperText={(touched.title && errors.title) || " "}
            error={Boolean(touched.title && errors.title)}
          />
          <TextField
            name="description"
            value={description}
            multiline
            rows={7}
            inputProps={{ maxLength: 1500 }}
            margin="dense"
            id="description"
            label="Description"
            type="text"
            fullWidth
            onChange={(e) => onChange(e.target.name, e.target.value)}
            onBlur={() => onBlur("description")}
            helperText={(touched.description && errors.description) || " "}
            error={Boolean(touched.description && errors.description)}
          />
          <TextField
            name="url"
            value={url}
            margin="dense"
            id="url"
            label="Url to course"
            type="text"
            fullWidth
            onChange={(e) => onChange(e.target.name, e.target.value)}
            onBlur={() => onBlur("url")}
            helperText={(touched.url && errors.url) || " "}
            error={Boolean(touched.url && errors.url)}
          />
          <TextField
            name="certificateUrl"
            value={certificateUrl}
            margin="dense"
            id="certificateUrl"
            label="Url to certificate"
            type="text"
            fullWidth
            onChange={(e) => onChange(e.target.name, e.target.value)}
            onBlur={() => onBlur("certificateUrl")}
            helperText={(touched.certificateUrl && errors.certificateUrl) || " "}
            error={Boolean(touched.certificateUrl && errors.certificateUrl)}
          />
          <FormControlLabel
            control={
              <Checkbox checked={completed} onChange={handleCheckBoxChange} inputProps={{ "aria-label": "controlled" }} />
            }
            label="Course completed"
          />
          <Box
            sx={{
              display: "flex",
              justifyContent: "start",
              flexWrap: "wrap",
              listStyle: "none",
              marginTop: 3,
              paddingBottom: !topicData.length ? 11 : 0,
            }}
          >
            <Autocomplete
              onChange={handleSkillChange}
              disablePortal
              id="combo-box-demo"
              ListboxProps={{
                style: {
                  maxHeight: 200,
                },
              }}
              options={skillsData}
              sx={{ width: 450, marginRight: 2 }}
              renderInput={(params) => <TextField {...params} label="Topics" />}
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
                    mt: 2,
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

          <FormControl fullWidth style={{ marginTop: 20, marginBottom: 20 }}>
            <InputLabel id="demo-simple-select-label">institution</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={institution}
              label="Institution"
              name="institution"
              onChange={(e) => onChange(e.target.name, e.target.value)}
              onBlur={() => onBlur("institution")}
              error={Boolean(touched.institution && errors.institution)}
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
      <Divider sx={{ marginBottom: 2 }} />
      <DialogActions>
        <Button color="error" onClick={onClose}>
          Cancel
        </Button>
        <Button color="success" onClick={onAddCourse} disabled={isDisabled()}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddCourseModal
