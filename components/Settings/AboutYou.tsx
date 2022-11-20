import React, { ChangeEvent, useState } from "react"
import { IUser } from "../../types/user"
import Button from "react-bootstrap/Button"
import Form from "react-bootstrap/Form"
import SubmitButton from "../SubmitButton"
import { fetcher } from "../../lib/fetcher"
import { toast } from "react-toastify"

const AboutYou = ({ user, mutate }: { user: IUser; mutate: Function }) => {
  console.log(user)
  const [userName, setUserName] = useState(user?.name || "")

  const [userBio, setUserBio] = useState(user?.bio || "")

  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = async (event: any) => {
    event.preventDefault()

    // this is to make it easier to update profile pic later.
    // https://dev.to/hoangvvo/how-i-build-a-full-fledged-app-with-next-js-and-mongodb-part-2-user-profile-and-profile-picture-hcp
    /*
    const formdata = new FormData()
    console.log(userBio)
    formdata.append("name", userName)
    formdata.append("bio", userBio)
    console.log(formdata)
    */

    /*

    */
    try {
      setIsLoading(true)
      const response = await fetcher("/api/user", {
        headers: { "Content-Type": "application/json" },
        method: "PATCH",
        body: JSON.stringify({
          name: userName,
          bio: userBio,
        }),
      })
      console.log(response)
      if (response.error) {
        setIsLoading(false)
        toast.error(response.error)
        setUserBio(user.bio)
        setUserName(user.name)
      } else {
        setIsLoading(false)
        mutate({ user: response.user }, false)
        toast.success("Your profile has been updated")
      }
    } catch (e) {
      setIsLoading(false)
      console.error(e)
    }
  }

  return (
    <>
      <h1>Abouy you</h1>
      <Form onSubmit={onSubmit}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Your name</Form.Label>
          <Form.Control
            onChange={(event: ChangeEvent<HTMLInputElement>) => setUserName(event.target.value)}
            value={userName}
            type="text"
            placeholder="Name"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Your bio</Form.Label>
          <Form.Control
            onChange={(event: ChangeEvent<HTMLInputElement>) => setUserBio(event.target.value)}
            value={userBio}
            as="textarea"
            rows={3}
            type="text"
            placeholder="Bio"
          />
        </Form.Group>
        <div className="d-grid gap-2">
          <SubmitButton
            isLoading={isLoading}
            isDisabled={userBio === "" || userName === "" || (user?.name === userName && user?.bio === userBio)}
          />
        </div>
      </Form>
    </>
  )
}

export default AboutYou
