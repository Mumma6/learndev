import { FormEvent, useEffect, useState } from "react"
import { Box, Button, Container, Link, Paper, TextField, Typography } from "@mui/material"
import NextLink from "next/link"
import { useRouter } from "next/router"
import { toast } from "react-toastify"
import { useCurrentUser } from "../../lib/hooks"
import SubmitButton from "../shared/SubmitButton"
import { fetcherTE } from "../../lib/axiosFetcher"
import { FaArrowLeft } from "react-icons/fa"
import { UserModelSchemaType, UserRegistrationSchema, UserRegistrationSchemaType } from "../../schema/UserSchema"
import { Status } from "../../types/status"
import { useZodFormValidation } from "zod-react-form"

import { pipe } from "fp-ts/function"
import * as TE from "fp-ts/TaskEither"

const initialState = {
  name: "",
  email: "",
  password: "",
}

const SignUp = () => {
  const { data, mutate } = useCurrentUser()
  const [status, setStatus] = useState<Status>("idle")

  const router = useRouter()

  const { values, errors, setFieldValue, onBlur, touched, isDisabled, setValues, reset } =
    useZodFormValidation<UserRegistrationSchemaType>(UserRegistrationSchema.omit({ name: true }), initialState)

  useEffect(() => {
    if (data?.payload) router.replace("/home")
  }, [data?.payload, router])

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus("loading")
    pipe(
      fetcherTE<UserModelSchemaType, UserRegistrationSchemaType>("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: values,
      }),
      TE.fold(
        (error) => {
          toast.error(error)
          setStatus("error")
          setValues(initialState)
          reset()
          return TE.left(error)
        },
        (data) => {
          mutate({ payload: data.payload }, false)
          toast.success("Your account has been created")
          setStatus("success")
          router.replace("/home")
          return TE.right(data)
        }
      )
    )()
  }

  return (
    <Box
      component="main"
      sx={{
        alignItems: "center",
        display: "flex",
        flexGrow: 1,
        minHeight: "100%",
        marginTop: 20,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={20}
          sx={{
            padding: 5,
          }}
        >
          <NextLink href="/" passHref>
            <Button disabled={status === "loading"} startIcon={<FaArrowLeft />}>
              Home
            </Button>
          </NextLink>
          <form onSubmit={onSubmit}>
            <Box sx={{ my: 3 }}>
              <Typography color="textPrimary" variant="h4">
                Create a new account
              </Typography>
            </Box>
            <Box
              sx={{
                pb: 1,
                pt: 1,
              }}
            >
              <Typography align="center" color="textSecondary" variant="body1">
                Use your email to create a new account
              </Typography>
            </Box>
            <TextField
              error={Boolean(touched.name && errors.name)}
              fullWidth
              helperText={touched.name && errors.name}
              label="Name"
              margin="normal"
              name="name"
              onBlur={() => onBlur("name")}
              onChange={(e) => setFieldValue("name", e.target.value)}
              value={values.name}
              variant="outlined"
            />
            <TextField
              error={Boolean(touched.email && errors.email)}
              fullWidth
              helperText={touched.email && errors.email}
              label="Email Address"
              margin="normal"
              name="email"
              type="email"
              onBlur={() => onBlur("email")}
              onChange={(e) => setFieldValue("email", e.target.value)}
              value={values.email}
              variant="outlined"
            />
            <TextField
              error={Boolean(touched.password && errors.password)}
              fullWidth
              helperText={touched.password && errors.password}
              label="Password"
              margin="normal"
              name="password"
              type="password"
              onBlur={() => onBlur("password")}
              onChange={(e) => setFieldValue("password", e.target.value)}
              value={values.password}
              variant="outlined"
            />
            <Box
              sx={{
                alignItems: "center",
                display: "flex",
                ml: -1,
              }}
            ></Box>

            <Box sx={{ py: 2 }}>
              <SubmitButton
                text="Sign up Now"
                isLoading={status === "loading" || status === "success"}
                isDisabled={isDisabled() || status === "loading" || status === "success"}
              />
            </Box>
            <Typography color="textSecondary" variant="body2">
              Have an account?{" "}
              <NextLink href="/login" passHref>
                <Link variant="subtitle2" underline="hover">
                  Sign In
                </Link>
              </NextLink>
            </Typography>
          </form>
        </Paper>
      </Container>
    </Box>
  )
}

export default SignUp
