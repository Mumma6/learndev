import { ChangeEvent, useCallback, useEffect, useState } from "react"
import { Box, Button, Container, Grid, Link, Paper, TextField, Typography } from "@mui/material"
import { useFormik } from "formik"
import { toFormikValidationSchema, toFormikValidate } from "zod-formik-adapter"
import NextLink from "next/link"
import { useRouter } from "next/router"
import { toast } from "react-toastify"
import { useCurrentUser } from "../../lib/hooks"
import SubmitButton from "../SubmitButton"
import { fetcher1 } from "../../lib/axiosFetcher"
import { IUser } from "../../types/user"
import { FaArrowLeft } from "react-icons/fa"
import { UserRegistrationSchema, UserRegistrationSchemaType } from "../../schema/UserSchema"

const initialState = {
  name: "",
  email: "",
  password: "",
}

const SignUp = () => {
  const { data, mutate } = useCurrentUser()

  const router = useRouter()

  const formik = useFormik({
    initialValues: initialState,
    validate: toFormikValidate(UserRegistrationSchema),
    onSubmit: (formValues) => {
      onSubmit(formValues)
    },
  })

  useEffect(() => {
    if (data?.payload) router.replace("/home")
  }, [data?.payload, router])

  const onSubmit = async (formValues: UserRegistrationSchemaType) => {
    try {
      const response = await fetcher1<IUser, UserRegistrationSchemaType>("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: formValues,
      })
      if (response.error) {
        toast.error(response.error)
      } else {
        mutate({ payload: response.payload }, false)
        toast.success("Your account has been created")
        router.replace("/home")
      }
    } catch (e: any) {
      console.log(e)
    } finally {
      formik.resetForm()
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
                Create a new account
              </Typography>
              <Typography color="textSecondary" gutterBottom variant="body2">
                Use your email to create a new account
              </Typography>
            </Box>
            <TextField
              error={Boolean(formik.touched.name && formik.errors.name)}
              fullWidth
              helperText={formik.touched.name && formik.errors.name}
              label="Name"
              margin="normal"
              name="name"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.name}
              variant="outlined"
            />
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
                isLoading={formik.isSubmitting}
                isDisabled={!formik.isValid || !formik.dirty}
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
