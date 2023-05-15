import { ChangeEvent, useEffect, useState } from "react"
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
import { Box, Divider, FormControl, InputLabel, MenuItem, Select, ListItemIcon, ListItemText } from "@mui/material"
import Autocomplete from "@mui/material/Autocomplete"
import { ClickEventRet, SetState } from "../../types/generics"
import { skillsData } from "../../constants/skillsData"
import { FaPlus } from "react-icons/fa"
import { SkillSchemaType } from "../../schema/SharedSchema"
import { CourseModelContentInputSchemaType, InstitutionEnum } from "../../schema/CourseSchema"
import { IZodFormValidation } from "zod-react-form"
import { StatusEnum } from "../../schema/CourseSchema"
import { ResourceModelSchemaType } from "../../schema/ResourceSchema"
import { useResources } from "../../lib/hooks"
import { pipe } from "fp-ts/function"
import * as A from "fp-ts/Array"
import * as O from "fp-ts/Option"
import * as TE from "fp-ts/TaskEither"

interface IProps {
  open: boolean
  handleClose: SetState<void>
  topicData: SkillSchemaType[]
  setTopicData: SetState<SkillSchemaType[]>
  onAddCourse: ClickEventRet<Promise<void>>
  zodForm: IZodFormValidation<CourseModelContentInputSchemaType>
}

const AddCourseModal = ({ open, handleClose, onAddCourse, setTopicData, topicData, zodForm }: IProps) => {
  const { title, description, institution, url, certificateUrl, duration, status, resources } = zodForm.values

  const { data: resourceData } = useResources()

  const [resourcesOptions, setResourcesOptions] = useState<ResourceModelSchemaType[]>([])

  useEffect(() => {
    setResourcesOptions(
      pipe(
        resourceData?.payload,
        O.fromNullable,
        O.fold(
          () => [],
          (resources) => resources
        )
      )
    )
  }, [resourceData])

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

  const onChange = (key: string, value: string | number) => {
    zodForm.setFieldValue(key as keyof Omit<CourseModelContentInputSchemaType, "resources">, value)
  }

  const handleTopicDelete = (topicToDelete: SkillSchemaType) => () => {
    setTopicData((topics) => topics.filter((topic) => topic.label !== topicToDelete.label))
  }

  const isDisabled = () => {
    const formErrors = Object.values(zodForm.errors).some((error) => error)

    if (formErrors || !topicData.length) {
      return true
    }

    return false
  }

  return (
    <Dialog open={open}>
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
            inputProps={{ maxLength: 1500 }}
            margin="dense"
            id="description"
            label="Description"
            type="text"
            fullWidth
            required
            onChange={(e) => onChange(e.target.name, e.target.value)}
            onBlur={() => zodForm.onBlur("description")}
            helperText={(zodForm.touched.description && zodForm.errors.description) || " "}
            error={Boolean(zodForm.touched.description && zodForm.errors.description)}
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
            onChange={(e) => onChange(e.target.name, Number(e.target.value))}
            onBlur={() => zodForm.onBlur("duration")}
            helperText={(zodForm.touched.duration && zodForm.errors.duration) || " "}
            error={Boolean(zodForm.touched.duration && zodForm.errors.duration)}
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
            onBlur={() => zodForm.onBlur("url")}
            helperText={(zodForm.touched.url && zodForm.errors.url) || " "}
            error={Boolean(zodForm.touched.url && zodForm.errors.url)}
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
            onBlur={() => zodForm.onBlur("certificateUrl")}
            helperText={(zodForm.touched.certificateUrl && zodForm.errors.certificateUrl) || " "}
            error={Boolean(zodForm.touched.certificateUrl && zodForm.errors.certificateUrl)}
          />

          <FormControl fullWidth style={{ marginTop: 20, marginBottom: 20 }}>
            <InputLabel>Course status</InputLabel>
            <Select
              value={status}
              label="Course status"
              name="status"
              onChange={(e) => onChange(e.target.name, e.target.value)}
              onBlur={() => zodForm.onBlur("status")}
              error={Boolean(zodForm.touched.status && zodForm.errors.status)}
            >
              <MenuItem value={StatusEnum.Enum.Done}>Done</MenuItem>
              <MenuItem value={StatusEnum.Enum["In progress"]}>In progress</MenuItem>
              <MenuItem value={StatusEnum.Enum.Wishlist}>Wishlist</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Resources</InputLabel>
            <Select
              labelId="mutiple-select-label"
              multiple
              label="Resources"
              value={resources}
              onChange={(e) => zodForm.setFieldValue("resources", e.target.value)}
              renderValue={(selected) => selected.join(", ")}
            >
              {resourcesOptions.map((option) => (
                <MenuItem key={option._id} value={option.title}>
                  <ListItemIcon>
                    <Checkbox checked={resources.indexOf(option.title) > -1} />
                  </ListItemIcon>
                  <ListItemText primary={option.title} />
                </MenuItem>
              ))}
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
              onChange={(e) => onChange(e.target.name, e.target.value)}
              onBlur={() => zodForm.onBlur("institution")}
              error={Boolean(zodForm.touched.institution && zodForm.errors.institution)}
            >
              {InstitutionEnum.options.sort().map((institution) => (
                <MenuItem key={institution} value={institution}>
                  {institution}
                </MenuItem>
              ))}
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
