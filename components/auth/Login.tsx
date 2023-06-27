import { type FormEvent, useEffect, useState } from "react"
import { pipe } from "fp-ts/function"
import * as TE from "fp-ts/TaskEither"
import { Box, Button, Container, Paper, TextField, Typography } from "@mui/material"
import NextLink from "next/link"
import { useRouter } from "next/router"
import { toast } from "react-toastify"
import { useCurrentUser } from "../../lib/hooks"
import SubmitButton from "../shared/SubmitButton"
import { fetcherTE } from "../../lib/axiosFetcher"
import { FaArrowLeft } from "react-icons/fa"
import { type UserModelSchemaType, UserRegistrationSchema, type UserRegistrationSchemaType } from "../../schema/UserSchema"
import { type Status } from "../../types/status"
import { useZodFormValidation } from "zod-react-form"

const initialState = {
  email: "",
  password: ""
}

type TLogin = Omit<UserRegistrationSchemaType, "name">

const Login = () => {
  const [status, setStatus] = useState<Status>("idle")
  const { data, mutate } = useCurrentUser()
  const router = useRouter()

  const { values, errors, setFieldValue, onBlur, touched, isDisabled, setValues, reset } = useZodFormValidation<TLogin>(
    UserRegistrationSchema.omit({ name: true }),
    initialState
  )

  useEffect(() => {
    if (data?.payload) {
      router.replace("/home")
    }
  }, [data?.payload, router])

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus("loading")
    pipe(
      fetcherTE<UserModelSchemaType, TLogin>("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: values
      }),
      TE.fold(
        (error) => {
          setStatus("error")
          toast.error(error)
          setValues(initialState)
          reset()
          return TE.left(error)
        },
        (data) => {
          mutate({ payload: data.payload }, false)
          setStatus("success")
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
        marginTop: 20
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={20}
          sx={{
            padding: 5
          }}
        >
          <NextLink href="/" passHref>
            <Button startIcon={<FaArrowLeft />}>Home</Button>
          </NextLink>
          <form onSubmit={onSubmit}>
            <Box sx={{ my: 3 }}>
              <Typography color="textPrimary" variant="h4">
                Sign in
              </Typography>
            </Box>
            <Box
              sx={{
                pb: 1,
                pt: 1
              }}
            >
              <Typography align="center" color="textSecondary" variant="body1">
                Login with your email address
              </Typography>
            </Box>
            <TextField
              fullWidth
              label="Email Address"
              margin="normal"
              name="email"
              onBlur={() => { onBlur("email") }}
              onChange={(e) => { setFieldValue("email", e.target.value) }}
              value={values.email}
              type="email"
              variant="outlined"
              placeholder=""
              helperText={(touched.email && errors.email) || " "}
              error={Boolean(touched.email && errors.email)}
            />
            <TextField
              error={Boolean(touched.password && errors.password)}
              fullWidth
              helperText={touched.password && errors.password}
              label="Password"
              margin="normal"
              name="password"
              onBlur={() => { onBlur("password") }}
              onChange={(e) => { setFieldValue("password", e.target.value) }}
              type="password"
              value={values.password}
              variant="outlined"
            />
            <Box sx={{ py: 2 }}>
              <SubmitButton
                text="Sign in Now"
                isLoading={status === "loading" || status === "success"}
                isDisabled={isDisabled() || status === "loading" || status === "success"}
              />
            </Box>
          </form>
          <NextLink href="/forgot-password" passHref>
            Forget password
          </NextLink>
          <div style={{ display: "flex" }}>
            <Typography mt={1} mr={1} color="textSecondary" variant="body2">
              Don&apos;t have an account?
            </Typography>
            <NextLink href="/sign-up">
              <Typography mt={1} color="textSecondary" variant="body2">
                Sign up
              </Typography>
            </NextLink>
          </div>
        </Paper>
      </Container>
    </Box>
  )
}

export default Login
