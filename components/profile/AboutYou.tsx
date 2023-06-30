import React, { type FormEvent, useEffect, useState } from "react"

import { toast } from "react-toastify"
import { pipe } from "fp-ts/function"
import * as TE from "fp-ts/TaskEither"
import SubmitButton from "../shared/SubmitButton"
import { Box, Card, CardContent, CardHeader, Divider, TextField, Typography } from "@mui/material"
import { fetcherTE } from "../../lib/axiosFetcher"
import { UserModelSchema, type UserModelSchemaType } from "../../schema/UserSchema"
import { useCurrentUser } from "../../lib/hooks"
import { useSWRConfig } from "swr"
import Checkbox from "@mui/material/Checkbox"
import * as _ from "lodash"

import { useZodFormValidation } from "zod-react-form"

/*

About and Goals should be next to eachother

*/

const initialFormState = {
  about: "",
  goals: "",
  from: "",
  lookingForWork: false
}

const AboutYou = () => {
  const { data } = useCurrentUser()

  const { mutate } = useSWRConfig()

  const [isLoading, setIsLoading] = useState(false)

  const { values, errors, setFieldValue, onBlur, touched, isDisabled, setValues } = useZodFormValidation<
  Pick<UserModelSchemaType, "about" | "goals" | "from" | "lookingForWork">
  >(UserModelSchema.pick({ about: true, goals: true }), initialFormState)

  useEffect(() => {
    if (data?.payload) {
      setValues({
        about: data?.payload?.about || "",
        goals: data?.payload?.goals || "",
        from: data?.payload?.from || "",
        lookingForWork: !!data?.payload?.lookingForWork
      })
    }
  }, [data?.payload])

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    pipe(
      fetcherTE<UserModelSchemaType, Pick<UserModelSchemaType, "about" | "goals" | "from" | "lookingForWork">>("/api/user", {
        headers: { "Content-Type": "application/json" },
        method: "PATCH",
        data: values
      }),
      TE.fold(
        (error) => {
          toast.error(error)
          setIsLoading(false)
          return TE.left(error)
        },
        (data) => {
          mutate("/api/user")
          toast.success("Your profile has been updated")
          setIsLoading(false)
          return TE.right(data)
        }
      )
    )()
  }

  return (
    <>
      <form onSubmit={onSubmit}>
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
              onBlur={() => { onBlur("about") }}
              onChange={(e) => { setFieldValue("about", e.target.value) }}
              value={values.about}
              type="text"
              variant="outlined"
              placeholder=""
              helperText={(touched.about && errors.about) || " "}
              error={Boolean(touched.about && errors.about)}
            />
            <TextField
              multiline
              rows={7}
              fullWidth
              label="Goals"
              margin="normal"
              name="goals"
              onBlur={() => { onBlur("goals") }}
              onChange={(e) => { setFieldValue("goals", e.target.value) }}
              value={values.goals}
              type="text"
              variant="outlined"
              placeholder=""
              helperText={(touched.goals && errors.goals) || " "}
              error={Boolean(touched.goals && errors.goals)}
            />
            <TextField
              fullWidth
              label="Where are you from"
              margin="normal"
              name="from"
              onBlur={() => { onBlur("from") }}
              onChange={(e) => { setFieldValue("from", e.target.value) }}
              value={values.from}
              type="text"
              variant="outlined"
              placeholder=""
              helperText={(touched.from && errors.from) || " "}
              error={Boolean(touched.from && errors.from)}
            />
            <Box sx={{ marginTop: 2 }}>
              <Typography variant="h6" color="text" sx={{ display: "inline-block", marginRight: 2 }}>
                Looking for work?
              </Typography>
              <Checkbox
                sx={{ transform: "scale(1.3)" }}
                name="lookingForWork"
                onChange={(e) => { setFieldValue("lookingForWork", e.target.checked) }}
                value={values.lookingForWork}
                checked={values.lookingForWork}
              />
            </Box>
          </CardContent>
          <Divider />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              p: 2,
              float: "right"
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
                isDisabled() ||
                _.isEqual(values, {
                  about: data?.payload?.about,
                  goals: data?.payload?.goals,
                  from: data?.payload?.from,
                  lookingForWork: data?.payload?.lookingForWork
                })
              }
            />
          </Box>
        </Card>
      </form>
    </>
  )
}

export default AboutYou
