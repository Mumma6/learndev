import React, { useEffect, useState } from "react"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import {
  ProjectModelFormInputSchema,
  ProjectModelFromInputType,
  ProjectModelType,
  ProjectStatusEnum,
} from "../../schema/ProjectSchema"
import { toFormikValidate } from "zod-formik-adapter"
import { useFormik } from "formik"
import { truncate } from "fs"
import { fetcher } from "../../lib/axiosFetcher"
import { SkillSchemaType } from "../../schema/SharedSchema"
import { toast } from "react-toastify"
import { useSWRConfig } from "swr"
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material"
import { skillsData } from "../../constants/skillsData"
import { FaPlus } from "react-icons/fa"
import SubmitButton from "../shared/SubmitButton"
import { isEqual } from "lodash"
import { useRouter } from "next/router"

interface IProps {
  open: boolean
  handleClose: () => void
  project: ProjectModelType
}

/*
change this to use zodReactFrom
*/

const EditProjectModal = ({ open, handleClose, project }: IProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const router = useRouter()
  const [techStack, setTechStack] = useState<SkillSchemaType[]>(project.techStack)
  const [newSkill, setNewSkill] = useState<SkillSchemaType | null>(null)

  const { title, description, sourceCodeUrl, deployedUrl, _id, status } = project

  // Create a useSkillsHook
  const addNewskill = () => {
    if (newSkill) {
      setTechStack((data) => [...data, newSkill])
      setNewSkill(null)
    }
  }

  const handleSkillChange = (e: React.SyntheticEvent, value: SkillSchemaType | null) => {
    setNewSkill(value)
  }

  const handleDelete = (techToDelete: SkillSchemaType) => () => {
    setTechStack((techs) => techs.filter((tech) => tech.label !== techToDelete.label))
  }

  const [disabled, setDisabeld] = useState(false)

  // https://www.joshwcomeau.com/nextjs/refreshing-server-side-props/
  // Gör en useRefreshSRRData hook.
  const refreshData = () => {
    router.replace(router.asPath)
    setIsRefreshing(true)
  }

  React.useEffect(() => {
    setIsRefreshing(false)
  }, [project])

  const formik = useFormik({
    initialValues: {
      title,
      description,
      sourceCodeUrl,
      deployedUrl,
      status,
    },
    onSubmit: (formValues) => {
      onAddProject(formValues)
    },
  })

  const isDisabled = () => {
    return (
      formik.values.title === project.title &&
      formik.values.description === project.description &&
      formik.values.deployedUrl === project.deployedUrl &&
      formik.values.sourceCodeUrl === project.sourceCodeUrl &&
      formik.values.status === project.status &&
      isEqual(techStack, project.techStack)
    )
  }

  useEffect(() => {
    setDisabeld(isDisabled())
  }, [formik.values, techStack, project])

  // Reseta formulärret korrekt. Om det finns ändringar, gör en prompt
  const onClose = () => {
    setNewSkill(null)
    handleClose()
  }

  // Vi kan ändra formValues till en partial om vi vill uppdatera fler saker än det som är i ModelFormInput.
  const onAddProject = async (formValues: any) => {
    try {
      setIsLoading(true)

      const response = await fetcher<ProjectModelType, Partial<ProjectModelType>>("/api/projects", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        data: {
          ...formValues,
          techStack,
          _id,
        },
      })

      if (response?.error) {
        toast.error(response.error)
      } else {
        refreshData()
        toast.success(response?.message)
      }
    } catch (e: any) {
      console.log(e)
    } finally {
      setIsLoading(false)
      handleClose()
    }
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle>{`Edit project ${project.title}`}</DialogTitle>
        <DialogContent>
          <DialogContentText>Edit your project here.</DialogContentText>
          <Box mt={2}>
            <TextField
              name="title"
              autoFocus
              margin="dense"
              id="name"
              label="Title"
              type="text"
              fullWidth
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.title}
              helperText={(formik.touched.title && formik.errors.title) || " "}
              error={Boolean(formik.touched.title && formik.errors.title)}
            />
            <TextField
              name="description"
              multiline
              rows={7}
              margin="dense"
              id="description"
              label="Description"
              type="text"
              fullWidth
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.description}
              helperText={(formik.touched.description && formik.errors.description) || " "}
              error={Boolean(formik.touched.description && formik.errors.description)}
            />
            <TextField
              name="deployedUrl"
              value={formik.values.deployedUrl}
              margin="dense"
              id="url"
              label="Link to site"
              type="text"
              fullWidth
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              helperText={(formik.touched.deployedUrl && formik.errors.deployedUrl) || " "}
              error={Boolean(formik.touched.deployedUrl && formik.errors.deployedUrl)}
            />
            <TextField
              name="sourceCodeUrl"
              value={formik.values.sourceCodeUrl}
              margin="dense"
              id="url"
              label="Source code link"
              type="text"
              fullWidth
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              helperText={(formik.touched.sourceCodeUrl && formik.errors.sourceCodeUrl) || " "}
              error={Boolean(formik.touched.sourceCodeUrl && formik.errors.sourceCodeUrl)}
            />
            <Box sx={{ marginTop: 2, marginBottom: 2 }}>
              <FormControl fullWidth style={{ marginTop: 20, marginBottom: 20 }}>
                <InputLabel id="demo-simple-select-label">Project status</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Course status"
                  name="status"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.status}
                >
                  <MenuItem value={ProjectStatusEnum.Enum.Done}>Done</MenuItem>
                  <MenuItem value={ProjectStatusEnum.Enum["In progress"]}>In progress</MenuItem>
                  <MenuItem value={ProjectStatusEnum.Enum.Planning}>Planning</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
          <Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "start",
                flexWrap: "wrap",
                listStyle: "none",
                paddingBottom: !techStack.length ? 5 : 0,
              }}
            >
              <Autocomplete
                onChange={handleSkillChange}
                disablePortal
                id="combo-box-demo"
                options={skillsData}
                sx={{ width: 400, marginRight: 2 }}
                renderInput={(params) => <TextField {...params} label="Skill" />}
              />
              <Button onClick={addNewskill} style={{ fontSize: 20 }} disabled={!newSkill}>
                <FaPlus />
              </Button>
            </Box>

            <Paper
              sx={{
                display: "flex",
                justifyContent: "start",
                flexWrap: "wrap",
                listStyle: "none",
                p: 0.5,
                mt: 8,
              }}
              component="ul"
            >
              {techStack.map((data) => (
                <Chip
                  key={data.label}
                  color="primary"
                  style={{ margin: 4 }}
                  label={data.label}
                  onDelete={handleDelete(data)}
                />
              ))}
            </Paper>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button sx={{ marginRight: 2 }} variant="contained" color="error" onClick={onClose}>
            Cancel
          </Button>
          <SubmitButton
            customStyle={{ margin: 1 }}
            color="success"
            fullWidth={false}
            size={"medium"}
            text="Update project"
            isLoading={isLoading || isRefreshing}
            isDisabled={!formik.isValid || disabled}
          />
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default EditProjectModal
