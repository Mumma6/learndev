import Head from "next/head"
import React, { FormEvent, useState, useEffect } from "react"
import { toast } from "react-toastify"
import { DashboardLayout } from "../components/dashboard/DashboardLayout"
import { useCurrentUser } from "../lib/hooks"
import { Box, Divider, TextField, Card, CardContent, Container, CardHeader, Typography } from "@mui/material"
import SubmitButton from "../components/shared/SubmitButton"
import { pipe } from "fp-ts/function"
import * as A from "fp-ts/Array"
import * as O from "fp-ts/Option"
import * as TE from "fp-ts/TaskEither"

import { useZodFormValidation } from "zod-react-form"
import {
  FeedbackInputSchema,
  FeedbackInputSchemaType,
  FeedbackModel,
  FeedbackModelSchemaType,
} from "../schema/FeedbackSchema"
import { fetcherTE } from "../lib/axiosFetcher"

const initialFormState = {
  good: "",
  bad: "",
  other: "",
}

const feedback = () => {
  const { data } = useCurrentUser()
  const [isLoading, setIsLoading] = useState(false)

  const { values, errors, setFieldValue, onBlur, touched, isDisabled, reset, setValues } = useZodFormValidation<
    Omit<FeedbackInputSchemaType, "reporterName" | "reporterEmail">
  >(FeedbackInputSchema.omit({ reporterEmail: true, reporterName: true }), initialFormState)

  // show a "thank you note on submiting"

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    pipe(
      fetcherTE<FeedbackModelSchemaType, Omit<FeedbackModelSchemaType, "_id" | "createdAt">>("/api/feedback", {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        data: {
          ...values,
          reporterName: data?.payload?.name!,
          reporterEmail: data?.payload?.email!,
        },
      }),
      TE.fold(
        (error) => {
          reset()
          setValues(initialFormState)
          toast.error(error)
          setIsLoading(false)
          return TE.left(error)
        },
        (data) => {
          reset()
          setValues(initialFormState)
          toast.success("Thank you for your feedback!")
          setIsLoading(false)
          return TE.right(data)
        }
      )
    )()
  }

  return (
    <>
      <DashboardLayout>
        <Head>
          <title>Feedback</title>
        </Head>
        <>
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              py: 8,
              marginTop: 2,
            }}
          >
            <Container maxWidth={false}>
              <form onSubmit={onSubmit}>
                <Card>
                  <CardHeader subheader="Leave any feedback here" title="Feedback" />
                  <Divider />
                  <CardContent>
                    <TextField
                      fullWidth
                      required
                      multiline
                      rows={4}
                      label="What do you like about Studify"
                      margin="normal"
                      name="good"
                      onBlur={() => onBlur("good")}
                      onChange={(e) => setFieldValue("good", e.target.value)}
                      value={values.good}
                      type="text"
                      variant="outlined"
                      placeholder=""
                      helperText={(touched.good && errors.good) || " "}
                      error={Boolean(touched.good && errors.good)}
                    />
                    <TextField
                      required
                      multiline
                      rows={4}
                      fullWidth
                      label="What do you not like about Studify"
                      margin="normal"
                      name="bad"
                      onBlur={() => onBlur("bad")}
                      onChange={(e) => setFieldValue("bad", e.target.value)}
                      value={values.bad}
                      type="text"
                      variant="outlined"
                      placeholder=""
                      helperText={(touched.bad && errors.bad) || " "}
                      error={Boolean(touched.bad && errors.bad)}
                    />
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label="Any other feedback"
                      margin="normal"
                      name="other"
                      onBlur={() => onBlur("other")}
                      onChange={(e) => setFieldValue("other", e.target.value)}
                      value={values.other}
                      type="text"
                      variant="outlined"
                      placeholder=""
                      helperText={(touched.other && errors.other) || " "}
                      error={Boolean(touched.other && errors.other)}
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
                      text="Submit"
                      isLoading={isLoading}
                      isDisabled={isDisabled()}
                    />
                  </Box>
                </Card>
              </form>
            </Container>
          </Box>
        </>
      </DashboardLayout>
    </>
  )
}

export default feedback
