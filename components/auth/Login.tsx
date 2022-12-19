import { ChangeEvent, useCallback, useEffect, useState } from "react"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { Button, Form, Container, Spinner } from "react-bootstrap"
import { toast } from "react-toastify"
import { useCurrentUser } from "../../lib/hooks"
import { fetcher } from "../../lib/fetcher"
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
