import { ChangeEvent, useState } from "react"

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
import { Box, Divider, FormControl, InputLabel, MenuItem, Select } from "@mui/material"
import Autocomplete from "@mui/material/Autocomplete"
import { ClickEventRet, SetState } from "../../types/generics"
import { skillsData } from "../../constants/skillsData"
import { FaPlus } from "react-icons/fa"
import { SkillSchemaType } from "../../schema/SharedSchema"
import { CourseModelContentInputSchemaType, InstitutionEnum } from "../../schema/CourseSchema"
import { IZodFormValidation } from "zod-react-form"
import { StatusEnum } from "../../schema/CourseSchema"

interface IProps {
  open: boolean
  handleClose: SetState<void>
  formValues: CourseModelContentInputSchemaType
  topicData: SkillSchemaType[]
  setTopicData: SetState<SkillSchemaType[]>
  onAddCourse: ClickEventRet<Promise<void>>
  setFieldValue: IZodFormValidation<CourseModelContentInputSchemaType>["setFieldValue"]
  errors: IZodFormValidation<CourseModelContentInputSchemaType>["errors"]
  onBlur: IZodFormValidation<CourseModelContentInputSchemaType>["onBlur"]
  touched: IZodFormValidation<CourseModelContentInputSchemaType>["touched"]
}

const AddCourseModal = ({
  open,
  handleClose,
  formValues,
  onAddCourse,

  setTopicData,
  topicData,
  setFieldValue,
  onBlur,
  touched,
  errors,
}: IProps) => {
  const { title, description, institution, url, certificateUrl, duration, status } = formValues

  const [newSkill, setNewSkill] = useState<SkillSchemaType | null>()

  const addNewskill = () => {
    if (newSkill) {
      setTopicData((data) => [...data, newSkill])
      setNewSkill(null)
    }
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
            required
            onChange={(e) => setFieldValue("title", e.target.value)}
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
            required
            onChange={(e) => setFieldValue("description", e.target.value)}
            onBlur={() => onBlur("description")}
            helperText={(touched.description && errors.description) || " "}
            error={Boolean(touched.description && errors.description)}
          />
          <TextField
            name="duration"
            value={duration}
            inputProps={{ min: 0 }}
            margin="dense"
            id="duration"
            label="Duration in hours"
            type="number"
            required
            fullWidth
            onChange={(e) => setFieldValue("duration", Number(e.target.value))} //onChange("duration", Number(e.target.value))}
            onBlur={() => onBlur("duration")}
            helperText={(touched.duration && errors.duration) || " "}
            error={Boolean(touched.duration && errors.duration)}
          />
          <TextField
            name="url"
            value={url}
            margin="dense"
            id="url"
            label="Url to course"
            type="text"
            fullWidth
            onChange={(e) => setFieldValue("url", e.target.value)}
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
            onChange={(e) => setFieldValue("certificateUrl", e.target.value)}
            onBlur={() => onBlur("certificateUrl")}
            helperText={(touched.certificateUrl && errors.certificateUrl) || " "}
            error={Boolean(touched.certificateUrl && errors.certificateUrl)}
          />

          <FormControl fullWidth style={{ marginTop: 20, marginBottom: 20 }}>
            <InputLabel>Course status</InputLabel>
            <Select
              value={status}
              label="Course status"
              name="status"
              onChange={(e) => setFieldValue("status", e.target.value)}
              onBlur={() => onBlur("status")}
              error={Boolean(touched.status && errors.status)}
            >
              <MenuItem value={StatusEnum.Enum.Done}>Done</MenuItem>
              <MenuItem value={StatusEnum.Enum["In progress"]}>In progress</MenuItem>
              <MenuItem value={StatusEnum.Enum.Wishlist}>Wishlist</MenuItem>
            </Select>
          </FormControl>

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
              renderInput={(params) => <TextField required {...params} label="Topics" />}
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
            <InputLabel id="demo-simple-select-label">Institution</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={institution}
              label="Institution"
              name="institution"
              onChange={(e) => setFieldValue("institution", e.target.value)}
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
