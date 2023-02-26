import { ChangeEvent, useCallback, useEffect, useState } from "react"
import { Box, Button, Container, Grid, Paper, TextField, Typography } from "@mui/material"
import { useFormik } from "formik"
import NextLink from "next/link"
import { useRouter } from "next/router"
import { toast } from "react-toastify"
import { useCurrentUser } from "../../lib/hooks"
import SubmitButton from "../SubmitButton"
import { fetcher1 } from "../../lib/axiosFetcher"
import { FaArrowLeft } from "react-icons/fa"
import { toFormikValidate } from "zod-formik-adapter"
import { UserModelSchemaType, UserRegistrationSchema, UserRegistrationSchemaType } from "../../schema/UserSchema"

const initialState = {
  email: "",
  password: "",
}

const Login = () => {
  const { data, mutate } = useCurrentUser()

  const router = useRouter()

  const formik = useFormik({
    initialValues: initialState,
    validate: toFormikValidate(UserRegistrationSchema.omit({ name: true })),
    onSubmit: (formValue) => {
      onSubmit(formValue)
    },
  })

  useEffect(() => {
    if (data?.payload) router.replace("/home")
  }, [data?.payload, router])

  const onSubmit = async (formValue: Omit<UserRegistrationSchemaType, "name">) => {
    const response = await fetcher1<UserModelSchemaType, Omit<UserRegistrationSchemaType, "name">>("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      data: formValue,
    })

    if (response.error) {
      toast.error(response.error)
      formik.resetForm()
    } else {
      mutate({ payload: response.payload })
    }
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
            <Button component="a" startIcon={<FaArrowLeft />}>
              Home
            </Button>
          </NextLink>
          <form onSubmit={formik.handleSubmit}>
            <Box sx={{ my: 3 }}>
              <Typography color="textPrimary" variant="h4">
                Sign in
              </Typography>
            </Box>
            <Box
              sx={{
                pb: 1,
                pt: 1,
              }}
            >
              <Typography align="center" color="textSecondary" variant="body1">
                Login with email address
              </Typography>
            </Box>
            <TextField
              error={Boolean(formik.touched.email && formik.errors.email)}
              fullWidth
              helperText={formik.touched.email && formik.errors.email}
              label="Email Address"
              margin="normal"
              name="email"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="email"
              value={formik.values.email}
              variant="outlined"
            />
            <TextField
              error={Boolean(formik.touched.password && formik.errors.password)}
              fullWidth
              helperText={formik.touched.password && formik.errors.password}
              label="Password"
              margin="normal"
              name="password"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="password"
              value={formik.values.password}
              variant="outlined"
            />
            <Box sx={{ py: 2 }}>
              <SubmitButton
                text="Sign in Now"
                isLoading={formik.isSubmitting}
                isDisabled={!formik.isValid || !formik.dirty}
              />
            </Box>
            <NextLink href="/forgot-password" passHref>
              Forget password
            </NextLink>
            <Typography color="textSecondary" variant="body2">
              Don&apos;t have an account? <NextLink href="/sign-up">Sign Up</NextLink>
            </Typography>
          </form>
        </Paper>
      </Container>
    </Box>
  )
}

export default Login
