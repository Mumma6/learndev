import { ChangeEvent, useCallback, useEffect, useState } from "react"
import { Box, Button, Container, Grid, Link, TextField, Typography } from "@mui/material"
import { useFormik } from "formik"
import * as Yup from "yup"
import NextLink from "next/link"
import { useRouter } from "next/router"
import { toast } from "react-toastify"
import { useCurrentUser } from "../../lib/hooks"
import SubmitButton from "../SubmitButton"
import { fetcher1 } from "../../lib/axiosFetcher"
import { IUser } from "../../types/user"
import { FaArrowLeft } from "react-icons/fa"

interface FormData {
  email: string
  password: string
}

const initialState = {
  email: "",
  password: "",
}

const Login = () => {
  const { data, mutate } = useCurrentUser()

  const router = useRouter()

  const formik = useFormik({
    initialValues: initialState,
    validationSchema: Yup.object({
      email: Yup.string().email("Must be a valid email").max(255).required("Email is required"),
      password: Yup.string().max(255).required("Password is required"),
    }),
    onSubmit: (formValue) => {
      onSubmit(formValue)
    },
  })

  useEffect(() => {
    if (data?.payload) router.replace("/home")
  }, [data?.payload, router])

  const onSubmit = async (formValue: FormData) => {
    const response = await fetcher1<IUser, FormData>("/api/auth", {
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
            <SubmitButton text="Sign in Now" isLoading={formik.isSubmitting} isDisabled={!formik.isValid || !formik.dirty} />
          </Box>
          <NextLink href="/forgot-password" passHref>
            Forget password
          </NextLink>
          <Typography color="textSecondary" variant="body2">
            Don&apos;t have an account? <NextLink href="/sign-up">Sign Up</NextLink>
          </Typography>
        </form>
      </Container>
    </Box>
  )
}

export default Login

/*
------------------------------------OLD COMPONENTET---------------



import { ChangeEvent, useCallback, useEffect, useState } from "react"

import Link from "next/link"
import { useRouter } from "next/router"
import { Button, Form, Container, Spinner } from "react-bootstrap"
import { toast } from "react-toastify"
import { useCurrentUser } from "../../lib/hooks"
import SubmitButton from "../SubmitButton"
import { fetcher1 } from "../../lib/axiosFetcher"
import { IUser } from "../../types/user"

interface FormData {
  email: string
  password: string
}

const initialState = {
  email: "",
  password: "",
}

const Login = () => {
  const [formData, setFormData] = useState<FormData>(initialState)

  const { email, password } = formData

  const [isLoading, setIsLoading] = useState(false)

  const { data, mutate, isValidating } = useCurrentUser()

  const router = useRouter()

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFormData((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }))
  }

  useEffect(() => {
    if (isValidating) return
    if (data?.payload) router.replace("/dashboard")
  }, [data?.payload, router, isValidating])

  const onSubmit = async (event: any) => {
    event.preventDefault()
    setIsLoading(true)

    const response = await fetcher1<IUser, FormData>("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      data: {
        email: email,
        password: password,
      },
    })

    if (response.error) {
      toast.error(response.error)
      setFormData(initialState)
    } else {
      mutate({ payload: response.payload })
    }

    setIsLoading(false)
  }

  return (
    <Container
      className="shadow-sm p-3 mb-5 bg-white rounded"
      style={{
        marginTop: 40,
        paddingTop: 20,
        paddingBottom: 20,
        backgroundColor: "white",
        width: 600,
      }}
    >
      <Container>
        <h1>En knapp som går till /</h1>
        <h1>Ändra allt till MUI</h1>
        <h1>Login</h1>
        <p>Login to acces you profile</p>
      </Container>
      <Form onSubmit={onSubmit}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Control name="email" value={email} type="email" placeholder="Enter email" onChange={onChange} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Control name="password" value={password} onChange={onChange} type="password" placeholder="Password" />
        </Form.Group>
        <Link href="/forgot-password" passHref>
          Forget password
        </Link>
        <div style={{ marginTop: 10 }} className="d-grid gap-2">
          <SubmitButton isLoading={isLoading} isDisabled={email === "" || password === ""} />
        </div>
      </Form>
    </Container>
  )
}

export default Login


*/
