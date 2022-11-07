import React from "react"
import { useCurrentUser } from "../../lib/hooks"
import { toast } from "react-toastify"
import { useRouter } from "next/router"
import { ChangeEvent, useCallback, useState } from "react"
import { Button, Form, Container } from "react-bootstrap"
import { fetcher } from "../../lib/fetcher"

interface FormData {
  name: string
  email: string
  password: string
}

const initialState = {
  name: "",
  email: "",
  password: "",
}

const SignUp = () => {
  const [formData, setFormData] = useState<FormData>(initialState)

  const { name, email, password } = formData

  // lägga denna i en useEffect?
  const { mutate } = useCurrentUser()

  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFormData((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }))
  }

  const onSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault()
    try {
      setIsLoading(true)
      const response = await fetcher("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name,
          password,
        }),
      })
      console.log(response)
      if (response.error) {
        console.log("toarst error")
        setFormData(initialState)
        toast.error(response.error.message)
      } else {
        mutate({ user: response.user }, false)
        toast("Your account has been created")
      }
    } catch (e: any) {
      console.log(e)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Container
      style={{
        marginTop: 40,
        paddingTop: 20,
        paddingBottom: 20,
        backgroundColor: "white",
        width: 600,
      }}
    >
      <Container>
        <h1>Register</h1>
        <p>Please create an account</p>
      </Container>
      <Form onSubmit={onSubmit}>
        <Form.Group className="mb-3">
          <Form.Control name="name" value={name} type="text" placeholder="Enter name" onChange={onChange} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Control name="email" value={email} type="email" placeholder="Enter email" onChange={onChange} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Control name="password" value={password} type="password" placeholder="Password" onChange={onChange} />
        </Form.Group>

        <div className="d-grid gap-2">
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </div>
      </Form>
    </Container>
  )
}

export default SignUp
