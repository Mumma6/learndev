import React, { useEffect, useState } from "react"
import {
  CourseModelSchemaType,
  CourseModelformInputSchema,
  CourseModelContentInputSchema,
  CourseModelformInputType,
  InstitutionEnum,
} from "../../schema/CourseSchema"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import { isEqual } from "lodash"
import { useRouter } from "next/router"
import { skillsData } from "../../constants/skillsData"
import { FaPlus } from "react-icons/fa"
import SubmitButton from "../SubmitButton"
import { SkillSchemaType } from "../../schema/SharedSchema"
import { useFormik } from "formik"
import { toFormikValidate } from "zod-formik-adapter"
import { fetcher1 } from "../../lib/axiosFetcher"
import { toast } from "react-toastify"
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Chip,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material"
import { FormControl } from "react-bootstrap"
import { z } from "zod"

interface IProps {
  open: boolean
  handleClose: () => void
  course: CourseModelSchemaType
}

const EditCourseModal = ({ open, handleClose, course }: IProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const router = useRouter()
  const [topicsData, setTopicsData] = useState<SkillSchemaType[]>(course.topics)
  const [newSkill, setNewSkill] = useState<SkillSchemaType | null>(null)

  const [disabled, setDisabeld] = useState(false)

  const { content, completed, _id } = course
  const { title, description, url, certificateUrl, institution } = content

  // Create a useSkillsHook
  const addNewskill = () => {
    if (newSkill) {
      setTopicsData((data) => [...data, newSkill])
      setNewSkill(null)
    }
  }

  const handleSkillChange = (e: React.SyntheticEvent, value: SkillSchemaType | null) => {
    setNewSkill(value)
  }

  const handleDelete = (topicToDelete: SkillSchemaType) => () => {
    setTopicsData((topics) => topics.filter((topic) => topic.label !== topicToDelete.label))
  }

  // https://www.joshwcomeau.com/nextjs/refreshing-server-side-props/
  // Gör en useRefreshSRRData hook.
  const refreshData = () => {
    router.replace(router.asPath)
    setIsRefreshing(true)
  }

  React.useEffect(() => {
    setIsRefreshing(false)
  }, [course])

  const validateSchema = CourseModelformInputSchema.omit({ content: true, topics: true }).merge(
    CourseModelContentInputSchema
  )

  type validateSchemaType = z.infer<typeof validateSchema>

  const formik = useFormik({
    initialValues: {
      title,
      description,
      url,
      certificateUrl,
      institution,
      completed,
    },
    validate: toFormikValidate(validateSchema),
    onSubmit: (formValues) => {
      onUpdateCourse(formValues)
    },
  })

  useEffect(() => {
    setDisabeld(isDisabled())
  }, [formik.values, topicsData, course])

  const isDisabled = () => {
    return (
      formik.values.title === course.content.title &&
      formik.values.description === course.content.description &&
      formik.values.url === course.content.url &&
      formik.values.certificateUrl === course.content.certificateUrl &&
      !!formik.values.completed === !!course.completed &&
      isEqual(topicsData, course.topics)
    )
  }

  // Reseta formulärret korrekt. Om det finns ändringar, gör en prompt
  const onClose = () => {
    setNewSkill(null)
    handleClose()
  }

  const onUpdateCourse = async (formValues: validateSchemaType) => {
    try {
      setIsLoading(true)

      const response = await fetcher1<CourseModelSchemaType, Partial<CourseModelSchemaType>>("/api/courses", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        data: {
          content: {
            title: formValues.title,
            description: formValues.description,
            url: formValues.url,
            certificateUrl: formValues.certificateUrl,
            institution: formValues.institution,
          },
          completed,
          topics: topicsData,
          _id,
        },
      })

      console.log(response)

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
        <DialogTitle>{`Edit course ${course.content.title}`}</DialogTitle>
        <DialogContent>
          <DialogContentText>Edit your course here.</DialogContentText>
          <Box>
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
              helperText={(formik.touched?.title && formik.errors?.title) || " "}
              error={Boolean(formik.touched?.title && formik.errors?.title)}
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
              helperText={(formik.touched?.description && formik.errors?.description) || " "}
              error={Boolean(formik.touched?.description && formik.errors?.description)}
              sx={{ mb: 2 }}
            />
            <TextField
              name="url"
              margin="dense"
              id="url"
              label="Link to site"
              type="text"
              fullWidth
              variant="standard"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.url}
              helperText={(formik.touched?.url && formik.errors?.url) || " "}
              error={Boolean(formik.touched?.url && formik.errors?.url)}
              sx={{ mb: 2 }}
            />
            <TextField
              name="certificateUrl"
              margin="dense"
              id="url"
              label="Source code link"
              type="text"
              fullWidth
              variant="standard"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.certificateUrl}
              helperText={(formik.touched?.certificateUrl && formik.errors?.certificateUrl) || " "}
              error={Boolean(formik.touched?.certificateUrl && formik.errors?.certificateUrl)}
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
                paddingBottom: !topicsData.length ? 5 : 0,
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
              {topicsData.map((data) => (
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

export default EditCourseModal

/*
 <FormControl style={{ marginTop: 20, marginBottom: 20 }}>
            <InputLabel id="demo-simple-select-label">institution</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Institution"
              name="institution"
              value={formik.values.institution}
              error={Boolean(formik.touched?.institution && formik.errors?.institution)}
            >
              <MenuItem value={InstitutionEnum.Enum.Other}>Other</MenuItem>
              <MenuItem value={InstitutionEnum.Enum.Udemy}>Udemy</MenuItem>
              <MenuItem value={InstitutionEnum.Enum.Linkedin}>Linkedin</MenuItem>
              <MenuItem value={InstitutionEnum.Enum.Pluralsight}>Pluralsight</MenuItem>
              <MenuItem value={InstitutionEnum.Enum.Youtube}>Youtube</MenuItem>
            </Select>
          </FormControl>
*/
