import React, { useEffect, useState } from "react"

import * as E from "fp-ts/Either"
import * as TE from "fp-ts/TaskEither"
import {
  CourseModelSchemaType,
  CourseModelformInputSchema,
  CourseModelContentInputSchema,
  CourseModelformInputType,
  InstitutionEnum,
  StatusEnum,
} from "../../schema/CourseSchema"
import Dialog from "@mui/material/Dialog"
import FormControl from "@mui/material/FormControl"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import { isEqual } from "lodash"
import { useRouter } from "next/router"
import { skillsData } from "../../constants/skillsData"
import { FaPlus } from "react-icons/fa"
import SubmitButton from "../shared/SubmitButton"
import { SkillSchemaType } from "../../schema/SharedSchema"
import { useFormik } from "formik"
import { toFormikValidate } from "zod-formik-adapter"
import { fetcher, fetcherTE } from "../../lib/axiosFetcher"
import { toast } from "react-toastify"
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Chip,
  InputLabel,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material"
import { z } from "zod"
import { useResources } from "../../lib/hooks"
import { pipe } from "fp-ts/function"
import * as A from "fp-ts/Array"
import * as O from "fp-ts/Option"

interface IProps {
  open: boolean
  handleClose: () => void
  course: CourseModelSchemaType
}

// change this to use zodReactFrom

const EditCourseModal = ({ open, handleClose, course }: IProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const router = useRouter()
  const [topicsData, setTopicsData] = useState<SkillSchemaType[]>(course.topics)
  const [newSkill, setNewSkill] = useState<SkillSchemaType | null>(null)

  const [disabled, setDisabeld] = useState(false)

  const { data: resourceData } = useResources()

  const { content, _id } = course
  const { title, description, url, certificateUrl, duration, status, institution, resources } = content

  const resourcesOptions = pipe(
    resourceData?.payload,
    O.fromNullable,
    O.map((resource) => resource.flatMap(({ title }) => title)),
    O.getOrElse<string[]>(() => [])
  )

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

  const formik = useFormik({
    initialValues: {
      title,
      description,
      url,
      certificateUrl,
      duration,
      status,
      institution,
      resources,
    },
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
      formik.values.duration === course.content.duration &&
      formik.values.certificateUrl === course.content.certificateUrl &&
      formik.values.status === course.content.status &&
      formik.values.institution === course.content.institution &&
      isEqual(topicsData, course.topics) &&
      isEqual(formik.values.resources, course.content.resources)
    )
  }

  // Reseta formulärret korrekt. Om det finns ändringar, gör en prompt
  const onClose = () => {
    setNewSkill(null)
    formik.resetForm()
    handleClose()
  }

  const onUpdateCourse = async (formValues: any) => {
    setIsLoading(true)

    pipe(
      fetcherTE<CourseModelSchemaType, Partial<CourseModelSchemaType>>("/api/courses", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        data: {
          content: {
            title: formValues.title,
            description: formValues.description,
            url: formValues.url,
            certificateUrl: formValues.certificateUrl,
            institution: course.content.institution,
            duration: formValues.duration,
            status: formValues.status,
            resources: formValues.resources,
          },
          topics: topicsData,
          _id,
        },
      }),
      TE.fold(
        (error) => {
          toast.error(error)
          setIsLoading(false)
          handleClose()
          return TE.left(error)
        },
        (response) => {
          console.log(response)
          refreshData()
          toast.success(response?.message)
          setIsLoading(false)
          handleClose()
          return TE.right(response)
        }
      )
    )()
  }

  return (
    <Dialog open={open}>
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle>{`Edit course ${course.content.title}`}</DialogTitle>
        <DialogContent>
          <DialogContentText>Edit your course here.</DialogContentText>
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
              helperText={(formik.touched?.title && formik.errors?.title) || " "}
              error={Boolean(formik.touched?.title && formik.errors?.title)}
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
              helperText={(formik.touched?.description && formik.errors?.description) || " "}
              error={Boolean(formik.touched?.description && formik.errors?.description)}
            />
            <TextField
              name="duration"
              inputProps={{ min: 0 }}
              margin="dense"
              id="duration"
              label="Duration in hours"
              type="number"
              fullWidth
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.duration}
              helperText={(formik.touched?.duration && formik.errors?.duration) || " "}
              error={Boolean(formik.touched?.duration && formik.errors?.duration)}
            />
            <TextField
              name="url"
              margin="dense"
              id="url"
              label="Link to site"
              type="text"
              fullWidth
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.url}
              helperText={(formik.touched?.url && formik.errors?.url) || " "}
              error={Boolean(formik.touched?.url && formik.errors?.url)}
            />
            <TextField
              name="certificateUrl"
              margin="dense"
              id="url"
              label="Source code link"
              type="text"
              fullWidth
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.certificateUrl}
              helperText={(formik.touched?.certificateUrl && formik.errors?.certificateUrl) || " "}
              error={Boolean(formik.touched?.certificateUrl && formik.errors?.certificateUrl)}
            />
            <Box sx={{ marginTop: 2, marginBottom: 2 }}>
              <FormControl fullWidth style={{ marginTop: 20, marginBottom: 20 }}>
                <InputLabel id="demo-simple-select-label">Course provider</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Course provider"
                  name="institution"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.institution}
                >
                  <MenuItem value={InstitutionEnum.Enum.Other}>Other</MenuItem>
                  <MenuItem value={InstitutionEnum.Enum.Udemy}>Udemy</MenuItem>
                  <MenuItem value={InstitutionEnum.Enum.Linkedin}>Linkedin</MenuItem>
                  <MenuItem value={InstitutionEnum.Enum.Pluralsight}>Pluralsight</MenuItem>
                  <MenuItem value={InstitutionEnum.Enum.Youtube}>Youtube</MenuItem>
                </Select>
              </FormControl>
              <FormControl style={{ marginTop: 10 }} fullWidth>
                <InputLabel>Resources</InputLabel>
                <Select
                  labelId="mutiple-select-label"
                  multiple
                  label="Resources"
                  name="resources"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.resources}
                  renderValue={(selected) => selected.filter((x) => resourcesOptions.includes(x)).join(", ")}
                >
                  {resourcesOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      <ListItemIcon>
                        <Checkbox checked={formik.values.resources.indexOf(option) > -1} />
                      </ListItemIcon>
                      <ListItemText primary={option} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ marginTop: 2, marginBottom: 2 }}>
              <FormControl fullWidth style={{ marginTop: 20, marginBottom: 20 }}>
                <InputLabel id="demo-simple-select-label">Status</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Course status"
                  name="status"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.status}
                >
                  <MenuItem value={StatusEnum.Enum.Done}>Done</MenuItem>
                  <MenuItem value={StatusEnum.Enum["In progress"]}>In progress</MenuItem>
                  <MenuItem value={StatusEnum.Enum.Wishlist}>Wishlist</MenuItem>
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
