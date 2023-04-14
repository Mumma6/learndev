import { useState, FormEvent, useEffect } from "react"
import Box from "@mui/material/Box"
import Card from "@mui/material/Card"
import { CardContent, CardHeader, Divider, TextField } from "@mui/material"
import { FaBlog, FaGithub, FaHome, FaLinkedin, FaTwitter, FaYoutube } from "react-icons/fa"
import * as _ from "lodash"
import { pipe } from "fp-ts/function"
import * as TE from "fp-ts/TaskEither"
import { CgWebsite } from "react-icons/cg"
import SubmitButton from "../shared/SubmitButton"
import { useCurrentUser } from "../../lib/hooks"
import { fetcher, fetcherTE } from "../../lib/axiosFetcher"
import { toast } from "react-toastify"
import { UserModelSchemaType, UserSocialsSchema, UserSocialsSchemaType } from "../../schema/UserSchema"
import { useZodFormValidation } from "zod-react-form"
import { useSWRConfig } from "swr"

const initialFormState = {
  twitter: "",
  youtube: "",
  linkedin: "",
  blog: "",
  personalWebsite: "",
  github: "",
}

const Socials = () => {
  const { data } = useCurrentUser()
  const { mutate } = useSWRConfig()
  const [isLoading, setIsLoading] = useState(false)

  const { values, errors, setFieldValue, onBlur, touched, isDisabled, setValues } =
    useZodFormValidation<UserSocialsSchemaType>(UserSocialsSchema, initialFormState)

  useEffect(() => {
    if (data?.payload?.socials) {
      setValues(data?.payload?.socials)
    }
  }, [data])

  interface Input {
    socials: UserSocialsSchemaType
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    pipe(
      fetcherTE<UserModelSchemaType, Input>("/api/user", {
        headers: { "Content-Type": "application/json" },
        method: "PATCH",
        data: {
          socials: values,
        },
      }),
      TE.fold(
        (error) => {
          toast.error(error)
          setIsLoading(false)
          console.log(error)
          return TE.left(error)
        },
        (data) => {
          console.log(data)
          mutate("/api/user")
          toast.success("Your profile has been updated")
          setIsLoading(false)
          return TE.right(data)
        }
      )
    )()
  }

  return (
    <form onSubmit={onSubmit}>
      <Card>
        <CardHeader title="Socials" subheader="Add your socials here" />
        <Divider />
        <CardContent>
          <Box>
            <Box sx={{ display: "flex", alignItems: "flex-end", marginBottom: 1 }}>
              <FaGithub style={{ marginRight: 25, marginBottom: 30, fontSize: 25 }} />
              <TextField
                label="Github"
                name="github"
                variant="standard"
                onBlur={() => onBlur("github")}
                onChange={(e) => setFieldValue("github", e.target.value)}
                value={values.github}
                type="text"
                helperText={(touched.github && errors.github) || " "}
                error={Boolean(touched.github && errors.github)}
                style={{ width: 500 }}
              />
            </Box>
            <Box sx={{ display: "flex", alignItems: "flex-end", marginBottom: 1 }}>
              <FaTwitter style={{ marginRight: 25, marginBottom: 30, fontSize: 25, color: "#00acee" }} />
              <TextField
                label="Twitter"
                name="twitter"
                onBlur={() => onBlur("twitter")}
                onChange={(e) => setFieldValue("twitter", e.target.value)}
                value={values.twitter}
                helperText={(touched.twitter && errors.twitter) || " "}
                error={Boolean(touched.twitter && errors.twitter)}
                type="text"
                variant="standard"
                style={{ width: 500 }}
              />
            </Box>
            <Box sx={{ display: "flex", alignItems: "flex-end", marginBottom: 1 }}>
              <FaLinkedin style={{ marginRight: 25, marginBottom: 30, fontSize: 25, color: "#0072b1" }} />
              <TextField
                label="Linkedin"
                name="linkedin"
                onBlur={() => onBlur("linkedin")}
                onChange={(e) => setFieldValue("linkedin", e.target.value)}
                value={values.linkedin}
                helperText={(touched.linkedin && errors.linkedin) || " "}
                error={Boolean(touched.linkedin && errors.linkedin)}
                type="text"
                variant="standard"
                style={{ width: 500 }}
              />
            </Box>
            <Box sx={{ display: "flex", alignItems: "flex-end", marginBottom: 1 }}>
              <FaYoutube style={{ marginRight: 25, marginBottom: 30, fontSize: 25, color: "#FF0000" }} />
              <TextField
                label="Youtube"
                name="youtube"
                onBlur={() => onBlur("youtube")}
                onChange={(e) => setFieldValue("youtube", e.target.value)}
                value={values.youtube}
                helperText={(touched.youtube && errors.youtube) || " "}
                error={Boolean(touched.youtube && errors.youtube)}
                type="text"
                variant="standard"
                style={{ width: 500 }}
              />
            </Box>
            <Box sx={{ display: "flex", alignItems: "flex-end", marginBottom: 1 }}>
              <CgWebsite style={{ marginRight: 25, marginBottom: 30, fontSize: 25 }} />
              <TextField
                label="Personal website"
                name="personalWebsite"
                onBlur={() => onBlur("personalWebsite")}
                onChange={(e) => setFieldValue("personalWebsite", e.target.value)}
                value={values.personalWebsite}
                helperText={(touched.personalWebsite && errors.personalWebsite) || " "}
                error={Boolean(touched.personalWebsite && errors.personalWebsite)}
                type="text"
                variant="standard"
                style={{ width: 500 }}
              />
            </Box>
            <Box sx={{ display: "flex", alignItems: "flex-end", marginBottom: 1 }}>
              <FaBlog style={{ marginRight: 25, marginBottom: 30, fontSize: 25 }} />
              <TextField
                label="Blog"
                name="blog"
                onBlur={() => onBlur("blog")}
                onChange={(e) => setFieldValue("blog", e.target.value)}
                value={values.blog}
                helperText={(touched.blog && errors.blog) || " "}
                error={Boolean(touched.blog && errors.blog)}
                type="text"
                variant="standard"
                style={{ width: 500 }}
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
              isDisabled={isDisabled() || _.isEqual(values, data?.payload?.socials)}
            />
          </Box>
        </CardContent>
      </Card>
    </form>
  )
}

export default Socials
