import React, { useEffect, useState } from "react"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import { ProjectModelFormInputSchema, ProjectModelFromInputType, ProjectModelType } from "../../schema/ProjectSchema"
import { toFormikValidate } from "zod-formik-adapter"
import { useFormik } from "formik"
import { truncate } from "fs"
import { fetcher1 } from "../../lib/axiosFetcher"
import { SkillSchemaType } from "../../schema/SharedSchema"
import { toast } from "react-toastify"
import { useSWRConfig } from "swr"
import { Autocomplete, Box, Button, Checkbox, Chip, Paper, TextField, Typography } from "@mui/material"
import { skillsData } from "../../constants/skillsData"
import { FaPlus } from "react-icons/fa"
import SubmitButton from "../SubmitButton"
import { isEqual } from "lodash"

interface IProps {
  open: boolean
  handleClose: () => void
  project: ProjectModelType
}

const EditProjectModal = ({ open, handleClose, project }: IProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const { mutate } = useSWRConfig()
  const [techStack, setTechStack] = useState<SkillSchemaType[]>(project.techStack)
  const [newSkill, setNewSkill] = useState<SkillSchemaType | null>(null)

  const { title, description, completed, sourceCodeUrl, deployedUrl } = project

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

  const formik = useFormik({
    initialValues: {
      title,
      description,
      completed,
      sourceCodeUrl,
      deployedUrl,
    },
    validate: toFormikValidate(ProjectModelFormInputSchema.omit({ techStack: true })),
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
      !!formik.values.completed === !!project.completed &&
      isEqual(techStack, project.techStack)
    )
  }

  useEffect(() => {
    setDisabeld(isDisabled())
  }, [formik.values, techStack])

  const onClose = () => {
    formik.resetForm()
    setTechStack(project.techStack)
    setNewSkill(null)
    handleClose()
  }

  const onAddProject = async (formValues: Omit<ProjectModelFromInputType, "techStack">) => {
    try {
      setIsLoading(true)

      const response = await fetcher1<ProjectModelType, ProjectModelFromInputType>("/api/projects", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        data: {
          ...formValues,
          techStack,
        },
      })

      console.log(response)

      if (response?.error) {
        toast.error(response.error)
      } else {
        mutate("/api/projects")
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
      <DialogTitle>{`Edit project ${project.title}`}</DialogTitle>
      <DialogContent>
        <DialogContentText>Edit your project here.</DialogContentText>
        <Box component="form">
          <TextField
            name="title"
            autoFocus
            margin="dense"
            id="name"
            label="Title"
            type="text"
            fullWidth
            sx={{ mb: 2 }}
            required
            variant="standard"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.title}
            helperText={(formik.touched.title && formik.errors.title) || " "}
            error={Boolean(formik.touched.title && formik.errors.title)}
          />
          <TextField
            name="description"
            required
            multiline
            rows={3}
            margin="dense"
            id="description"
            label="Description"
            type="text"
            fullWidth
            variant="standard"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.description}
            helperText={(formik.touched.description && formik.errors.description) || " "}
            error={Boolean(formik.touched.description && formik.errors.description)}
            sx={{ mb: 2 }}
          />
          <TextField
            name="deployedUrl"
            value={formik.values.deployedUrl}
            margin="dense"
            id="url"
            label="Link to site"
            type="text"
            fullWidth
            variant="standard"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            helperText={(formik.touched.deployedUrl && formik.errors.deployedUrl) || " "}
            error={Boolean(formik.touched.deployedUrl && formik.errors.deployedUrl)}
            sx={{ mb: 2 }}
          />
          <TextField
            name="sourceCodeUrl"
            value={formik.values.sourceCodeUrl}
            margin="dense"
            id="url"
            label="Source code link"
            type="text"
            fullWidth
            variant="standard"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            helperText={(formik.touched.sourceCodeUrl && formik.errors.sourceCodeUrl) || " "}
            error={Boolean(formik.touched.sourceCodeUrl && formik.errors.sourceCodeUrl)}
            sx={{ mb: 2 }}
          />
          <Box sx={{ marginTop: 2, marginBottom: 2 }}>
            <Typography variant="h6" color="text" sx={{ display: "inline-block", marginRight: 2 }}>
              Completed
            </Typography>
            <Checkbox
              sx={{ transform: "scale(1)" }}
              name="completed"
              onChange={formik.handleChange}
              value={formik.values.completed}
              checked={formik.values.completed}
            />
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
          isLoading={isLoading}
          isDisabled={!formik.isValid || disabled}
        />
      </DialogActions>
    </Dialog>
  )
}

export default EditProjectModal
