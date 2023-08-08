import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputLabel,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  TextField,
} from "@mui/material"

import React, { useEffect, useState } from "react"
import { useFormik } from "formik"
import { type IQuiz } from "../../../models/Quiz"
import * as O from "fp-ts/Option"
import { pipe } from "fp-ts/function"

interface IProps {
  open: boolean
  quiz: O.Option<IQuiz>
  handleClose: () => void
}

const EditQuizModal = ({ open, quiz, handleClose }: IProps) => {
  console.log(quiz)
  const initialValues = {
    title: "",
    description: "",
  }

  const formik = useFormik({
    initialValues,
    onSubmit: (formValues) => console.log(formValues),
  })

  useEffect(() => {
    // Use fp-ts pipe to handle the Option type
    const initialValues = pipe(
      quiz,
      O.getOrElse(() => initialValues)
    )

    // Set the form values to the new initial values
    formik.setValues(initialValues)
  }, [quiz]) // This effect will re-run whenever the `quiz` prop changes

  return (
    <Dialog open={open}>
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle>{`Edit ${formik.values.title}`}</DialogTitle>
        <DialogContent>
          <DialogContentText>Edit the quiz here.</DialogContentText>
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
          </Box>
        </DialogContent>
        <DialogActions>
          <Button sx={{ marginRight: 2 }} variant="contained" color="error" onClick={handleClose}>
            Cancel
          </Button>
          <Button>Update</Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default EditQuizModal
