import { useEffect, useState, FormEvent, ChangeEvent } from "react"
import Box from "@mui/material/Box"
import Card from "@mui/material/Card"
import { Button, CardContent, CardHeader, Divider, TextField, Typography } from "@mui/material"
import { FaBlog, FaGithub, FaHome, FaLinkedin, FaTwitter, FaYoutube } from "react-icons/fa"
import * as _ from "lodash"

import { CgWebsite } from "react-icons/cg"
import SubmitButton from "../SubmitButton"
import { useCurrentUser } from "../../lib/hooks"
import { fetcher1 } from "../../lib/axiosFetcher"
import { ISocials, IUser } from "../../types/user"
import { toast } from "react-toastify"
import { useOnChange } from "../customHooks/useOnChange"

const initialFormState: ISocials = {
  twitter: "",
  youtube: "",
  linkedin: "",
  blog: "",
  personalWebsite: "",
  github: "",
}

const Socials = () => {
  const { data, mutate } = useCurrentUser()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState(initialFormState)

  useEffect(() => {
    if (data?.payload) {
      setFormData({
        ...data.payload.socials,
      })
    }
  }, [data])

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    useOnChange(event, setFormData)
  }

  const { twitter, linkedin, youtube, blog, personalWebsite, github } = formData

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      setIsLoading(true)
      const socials = {
        ...formData,
      }

      const response = await fetcher1<IUser, Pick<IUser, "socials">>("/api/user", {
        headers: { "Content-Type": "application/json" },
        method: "PATCH",
        data: {
          socials: socials,
        },
      })
      if (response.error) {
        toast.error(response.error)
        setIsLoading(false)
      } else {
        console.log(response)
        mutate({ payload: response.payload }, false)
        toast.success("Your profile has been updated")
        setIsLoading(false)
      }
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <Card>
        <CardHeader title="Socials" subheader="Add your socials here" />
        <Divider />
        <CardContent>
          <Box>
            <Box sx={{ display: "flex", alignItems: "flex-end", marginBottom: 1 }}>
              <FaGithub style={{ marginRight: 15, fontSize: 25 }} />
              <TextField
                value={github}
                name="github"
                label="Github"
                variant="standard"
                onChange={onChange}
                style={{ width: 500 }}
              />
            </Box>
            <Box sx={{ display: "flex", alignItems: "flex-end", marginBottom: 1 }}>
              <FaTwitter style={{ marginRight: 15, fontSize: 25, color: "#00acee" }} />
              <TextField
                value={twitter}
                onChange={onChange}
                name="twitter"
                style={{ width: 500 }}
                id="input-with-sx"
                label="Twitter"
                variant="standard"
              />
            </Box>
            <Box sx={{ display: "flex", alignItems: "flex-end", marginBottom: 1 }}>
              <FaLinkedin style={{ marginRight: 15, fontSize: 25, color: "#0072b1" }} />
              <TextField
                value={linkedin}
                name="linkedin"
                onChange={onChange}
                style={{ width: 500 }}
                id="input-with-sx"
                label="Linkedin"
                variant="standard"
              />
            </Box>
            <Box sx={{ display: "flex", alignItems: "flex-end", marginBottom: 1 }}>
              <FaYoutube style={{ marginRight: 15, fontSize: 25, color: "#FF0000" }} />
              <TextField
                value={youtube}
                name="youtube"
                onChange={onChange}
                style={{ width: 500 }}
                id="input-with-sx"
                label="Youtube"
                variant="standard"
              />
            </Box>
            <Box sx={{ display: "flex", alignItems: "flex-end", marginBottom: 1 }}>
              <CgWebsite style={{ marginRight: 15, fontSize: 25 }} />
              <TextField
                onChange={onChange}
                name="personalWebsite"
                value={personalWebsite}
                style={{ width: 500 }}
                id="input-with-sx"
                label="Personal site"
                variant="standard"
              />
            </Box>
            <Box sx={{ display: "flex", alignItems: "flex-end", marginBottom: 1 }}>
              <FaBlog style={{ marginRight: 15, fontSize: 25 }} />
              <TextField
                name="blog"
                value={blog}
                onChange={onChange}
                style={{ width: 500 }}
                id="input-with-sx"
                label="Blog"
                variant="standard"
              />
            </Box>
          </Box>
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
              text="Update socials"
              isLoading={isLoading}
              isDisabled={_.isEqual(formData, data?.payload?.socials)}
            />
          </Box>
        </CardContent>
      </Card>
    </form>
  )
}

export default Socials
