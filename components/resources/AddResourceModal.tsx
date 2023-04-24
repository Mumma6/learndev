import React, { ChangeEvent, useState, useEffect } from "react"
import TextField from "@mui/material/TextField"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import Button from "@mui/material/Button"
import { ClickEventRet, SetState } from "../../types/generics"
import { IZodFormValidation, useZodFormValidation } from "zod-react-form"
import { useCourses, useProjects } from "../../lib/hooks"
import { CourseModelSchemaType } from "../../schema/CourseSchema"
import { ProjectModelType } from "../../schema/ProjectSchema"
import { Autocomplete, Box, Typography, Checkbox, FormControl, InputLabel, MenuItem, Select, Divider } from "@mui/material"
import * as A from "fp-ts/Array"
import * as O from "fp-ts/Option"
import { pipe } from "fp-ts/function"
import {
  ResourceModelInputSchema,
  ResourceModelInputSchemaType,
  ResourceModelSchemaType,
  ResourceTypeEnum,
} from "../../schema/ResourceSchema"
import * as TE from "fp-ts/TaskEither"
import { toast } from "react-toastify"
import { fetcherTE } from "../../lib/axiosFetcher"
import { useSWRConfig } from "swr"

/*

zod sakerna ska vara här

addResource ska vara här

*/

interface IProps {
  open: boolean
  handleClose: () => void
}

const initialState: ResourceModelInputSchemaType = {
  title: "",
  description: "",
  link: "",
  type: ResourceTypeEnum.Enum.Other,
}

const AddResourceModal = ({ open, handleClose }: IProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const zodForm = useZodFormValidation<ResourceModelInputSchemaType>(ResourceModelInputSchema, initialState)
  const { mutate } = useSWRConfig()

  const { title, description, link, type } = zodForm.values

  const onClose = () => {
    handleClose()
    zodForm.setValues(initialState)
    zodForm.reset()
  }

  const onAdd = async () => {
    setIsLoading(true)
    pipe(
      fetcherTE<ResourceModelSchemaType, ResourceModelInputSchemaType>("/api/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: {
          ...zodForm.values,
        },
      }),
      TE.fold(
        (error) => {
          toast.error(error)
          zodForm.setValues(initialState)
          zodForm.reset()
          return TE.left(error)
        },
        (data) => {
          toast.success(data.message)
          mutate("/api/resources")
          onClose()
          return TE.right(data)
        }
      )
    )()
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add resource</DialogTitle>
      <DialogContent>
        <DialogContentText>Add a all your resources here </DialogContentText>
        <Box component="form" sx={{ marginTop: 2 }}>
          <TextField
            name="title"
            value={title}
            autoFocus
            margin="dense"
            id="name"
            label="Title"
            type="text"
            fullWidth
            required
            onChange={(e) => zodForm.setFieldValue("title", e.target.value)}
            onBlur={() => zodForm.onBlur("title")}
            helperText={(zodForm.touched.title && zodForm.errors.title) || " "}
            error={Boolean(zodForm.touched.title && zodForm.errors.title)}
          />
          <TextField
            name="description"
            value={description}
            margin="dense"
            id="description"
            label="Description"
            type="text"
            fullWidth
            required
            onChange={(e) => zodForm.setFieldValue("description", e.target.value)}
            onBlur={() => zodForm.onBlur("description")}
            helperText={(zodForm.touched.description && zodForm.errors.description) || " "}
            error={Boolean(zodForm.touched.description && zodForm.errors.description)}
          />
          <TextField
            name="link"
            value={link}
            margin="dense"
            id="link"
            label="Link"
            type="text"
            fullWidth
            required
            onChange={(e) => zodForm.setFieldValue("link", e.target.value)}
            onBlur={() => zodForm.onBlur("link")}
            helperText={(zodForm.touched.link && zodForm.errors.link) || " "}
            error={Boolean(zodForm.touched.link && zodForm.errors.link)}
          />
          <FormControl fullWidth style={{ marginTop: 20, marginBottom: 20 }}>
            <InputLabel>Resource prio</InputLabel>
            <Select
              value={type}
              label="Resource type"
              name="type"
              onChange={(e) => zodForm.setFieldValue("type", e.target.value)}
              onBlur={() => zodForm.onBlur("link")}
              error={Boolean(zodForm.touched.link && zodForm.errors.link)}
            >
              <MenuItem value={ResourceTypeEnum.Enum.Article}>Article</MenuItem>
              <MenuItem value={ResourceTypeEnum.Enum.Blog}>Blog</MenuItem>
              <MenuItem value={ResourceTypeEnum.Enum.Book}>Book</MenuItem>
              <MenuItem value={ResourceTypeEnum.Enum["Cheat sheet"]}>Cheat sheet</MenuItem>
              <MenuItem value={ResourceTypeEnum.Enum["Code repository"]}>Code repository</MenuItem>
              <MenuItem value={ResourceTypeEnum.Enum.Documentation}>Documentation</MenuItem>
              <MenuItem value={ResourceTypeEnum.Enum.Forum}>Forum</MenuItem>
              <MenuItem value={ResourceTypeEnum.Enum.Podcast}>Podcast</MenuItem>
              <MenuItem value={ResourceTypeEnum.Enum.Tutorial}>Tutorial</MenuItem>
              <MenuItem value={ResourceTypeEnum.Enum.Other}>Other</MenuItem>
              <MenuItem value={ResourceTypeEnum.Enum["Video clip"]}>Video clip</MenuItem>
              <MenuItem value={ResourceTypeEnum.Enum.Website}>Website</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>

      <Divider sx={{ marginBottom: 2 }} />
      <DialogActions>
        <Button color="error" onClick={onClose}>
          Cancel
        </Button>
        <Button
          color="success"
          onClick={onAdd}
          disabled={zodForm.isDisabled() || Object.values(zodForm.errors).some((error) => error)}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddResourceModal
