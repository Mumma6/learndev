import React, { ChangeEvent, useEffect, useState } from "react"

import { toast } from "react-toastify"

import { useFormik } from "formik"

import SubmitButton from "../SubmitButton"
import { Box, Alert, Card, CardContent, CardHeader, Divider, TextField, Typography } from "@mui/material"
import { fetcher1 } from "../../lib/axiosFetcher"
import { toFormikValidate } from "zod-formik-adapter"
import { UserModelSchema, UserModelSchemaType } from "../../schema/UserSchema"
import { useCurrentUser } from "../../lib/hooks"
import { useSWRConfig } from "swr"
import Checkbox from "@mui/material/Checkbox"

const AboutYou = () => {
  const { data } = useCurrentUser()

  const { mutate } = useSWRConfig()

  const [isLoading, setIsLoading] = useState(false)

  const [disabled, setDisabeld] = useState(false)
  const formik = useFormik({
    initialValues: {
      about: data?.payload?.about || "",
      goals: data?.payload?.goals || "",
      from: data?.payload?.from || "",
      lookingForWork: !!data?.payload?.lookingForWork,
    },
    validate: toFormikValidate(UserModelSchema.pick({ about: true, goals: true })),
    onSubmit: (formValues) => {
      onSubmit(formValues)
    },
  })

  const isDisabled = () => {
    return (
      formik.values.about === data?.payload?.about &&
      formik.values.goals === data?.payload.goals &&
      formik.values.from === data?.payload.from &&
      !!formik.values.lookingForWork === !!data?.payload.lookingForWork
    )
  }

  useEffect(() => {
    setDisabeld(isDisabled())
  }, [data?.payload, formik.values])

  const onSubmit = async (formValues: Pick<UserModelSchemaType, "about" | "goals" | "from" | "lookingForWork">) => {
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
      const response = await fetcher1<
        UserModelSchemaType,
        Pick<UserModelSchemaType, "about" | "goals" | "from" | "lookingForWork">
      >("/api/user", {
        headers: { "Content-Type": "application/json" },
        method: "PATCH",
        data: formValues,
      })

      console.log(response)

      if (response.error) {
        toast.error(response.error)
        formik.setFieldValue("goals", data?.payload?.goals || "")
        formik.setFieldValue("about", data?.payload?.about || "")
        formik.setFieldValue("from", data?.payload?.from || "")
        formik.setFieldValue("lookingForWork", data?.payload?.lookingForWork || "")
        setIsLoading(false)
      } else {
        mutate("/api/user")
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
          <CardHeader subheader="Update your info and tell us a about yourself" title="Profile information" />
          <Divider />
          <CardContent>
            <TextField
              multiline
              rows={7}
              fullWidth
              label="About"
              margin="normal"
              name="about"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.about}
              type="text"
              variant="outlined"
              placeholder=""
              helperText={(formik.touched.about && formik.errors.about) || " "}
              error={Boolean(formik.touched.about && formik.errors.about)}
            />
            <TextField
              multiline
              rows={7}
              fullWidth
              label="Goals"
              margin="normal"
              name="goals"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.goals}
              type="text"
              variant="outlined"
              placeholder=""
              helperText={(formik.touched.goals && formik.errors.goals) || " "}
              error={Boolean(formik.touched.goals && formik.errors.goals)}
            />
            <TextField
              fullWidth
              label="Where are you from"
              margin="normal"
              name="from"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.from}
              type="text"
              variant="outlined"
              placeholder=""
            />
            <Box sx={{ marginTop: 2 }}>
              <Typography variant="h6" color="text" sx={{ display: "inline-block", marginRight: 2 }}>
                Looking for work?
              </Typography>
              <Checkbox
                sx={{ transform: "scale(1.3)" }}
                name="lookingForWork"
                onChange={formik.handleChange}
                value={formik.values.lookingForWork}
                checked={formik.values.lookingForWork}
              />
            </Box>
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
              isDisabled={!formik.isValid || disabled}
            />
          </Box>
        </Card>
      </form>
    </>
  )
}

export default AboutYou
