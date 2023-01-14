import React, { ChangeEvent, useState } from "react"
import { IUser } from "../../types/user"

import { fetcher } from "../../lib/fetcher"
import { toast } from "react-toastify"

import { useFormik } from "formik"
import * as Yup from "yup"

import SubmitButton from "../SubmitButton"
import { Box, Alert, Card, CardContent, CardHeader, Divider, TextField } from "@mui/material"
import { fetcher1 } from "../../lib/axiosFetcher"
import { Mutate } from "../../types/generics"

interface FormData {
  name: string
  bio: string
}

const AboutYou = ({ user, mutate }: { user: IUser; mutate: Mutate<IUser | null> }) => {
  const [isLoading, setIsLoading] = useState(false)
  const formik = useFormik({
    initialValues: {
      name: user.name,
      bio: user.bio,
    },
    validationSchema: Yup.object({
      name: Yup.string().max(255).required("Name is required"),
      bio: Yup.string().max(255).required("Bio is required"),
    }),
    onSubmit: (formValues) => {
      onSubmit(formValues)
    },
  })

  const onSubmit = async (formValues: FormData) => {
    // this is to make it easier to update profile pic later.
    // https://dev.to/hoangvvo/how-i-build-a-full-fledged-app-with-next-js-and-mongodb-part-2-user-profile-and-profile-picture-hcp
    /*
    const formdata = new FormData()
    console.log(bio)
    formdata.append("name", name)
    formdata.append("bio", bio)
    console.log(formdata)
    */

    /*

    */
    try {
      setIsLoading(true)
      const response = await fetcher1<IUser, FormData>("/api/user", {
        headers: { "Content-Type": "application/json" },
        method: "PATCH",
        data: formValues,
      })
      if (response.error) {
        toast.error(response.error)
        formik.setFieldValue("name", user.name)
        formik.setFieldValue("bio", user.bio)
        setIsLoading(false)
      } else {
        mutate({ payload: response.payload }, false)
        toast.success("Your profile has been updated")
        setIsLoading(false)
      }
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Card>
          <CardHeader subheader="Update your info" title="Profile information" />
          <Divider />
          <CardContent>
            <TextField
              fullWidth
              label="Name"
              margin="normal"
              name="name"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="text"
              value={formik.values.name}
              variant="outlined"
            />
            <TextField
              multiline
              rows={3}
              fullWidth
              label="Bio"
              margin="normal"
              name="bio"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.bio}
              type="text"
              variant="outlined"
              placeholder=""
            />
          </CardContent>
          <Divider />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              p: 2,
              float: "right",
            }}
          >
            <SubmitButton
              customStyle={{ margin: 1 }}
              color="success"
              fullWidth={false}
              size={"medium"}
              text="Update information"
              isLoading={isLoading}
              isDisabled={
                !formik.isValid || !formik.dirty || (formik.values.bio === user.bio && formik.values.name === user.name)
              }
            />
          </Box>
        </Card>
      </form>
    </>
  )
}

export default AboutYou
