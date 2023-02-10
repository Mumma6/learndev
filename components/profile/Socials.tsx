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
import { toast } from "react-toastify"
import { useFormik } from "formik"
import { toFormikValidate } from "zod-formik-adapter"
import { UserModelSchemaType, UserSocialsSchema, UserSocialsSchemaType } from "../../schema/UserSchema"

const initialFormState = {
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

  const formik = useFormik({
    initialValues: {
      ...(data?.payload?.socials ? data?.payload?.socials : initialFormState),
    },
    validate: toFormikValidate(UserSocialsSchema),
    onSubmit: (formValue) => {
      onSubmit(formValue)
    },
  })

  const onSubmit = async (formValue: UserSocialsSchemaType) => {
    console.log("submit")
    try {
      setIsLoading(true)

      interface Input {
        socials: UserSocialsSchemaType
      }

      const response = await fetcher1<UserModelSchemaType, Input>("/api/user", {
        headers: { "Content-Type": "application/json" },
        method: "PATCH",
        data: {
          socials: formValue,
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
    <form onSubmit={formik.handleSubmit}>
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
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.github}
                type="text"
                helperText={(formik.touched.github && formik.errors.github) || " "}
                error={Boolean(formik.touched.github && formik.errors.github)}
                style={{ width: 500 }}
              />
            </Box>
            <Box sx={{ display: "flex", alignItems: "flex-end", marginBottom: 1 }}>
              <FaTwitter style={{ marginRight: 25, marginBottom: 30, fontSize: 25, color: "#00acee" }} />
              <TextField
                label="Twitter"
                name="twitter"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.twitter}
                helperText={(formik.touched.twitter && formik.errors.twitter) || " "}
                error={Boolean(formik.touched.twitter && formik.errors.twitter)}
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
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.linkedin}
                helperText={(formik.touched.linkedin && formik.errors.linkedin) || " "}
                error={Boolean(formik.touched.linkedin && formik.errors.linkedin)}
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
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.youtube}
                helperText={(formik.touched.youtube && formik.errors.youtube) || " "}
                error={Boolean(formik.touched.youtube && formik.errors.youtube)}
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
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.personalWebsite}
                helperText={(formik.touched.personalWebsite && formik.errors.personalWebsite) || " "}
                error={Boolean(formik.touched.personalWebsite && formik.errors.personalWebsite)}
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
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.blog}
                helperText={(formik.touched.blog && formik.errors.blog) || " "}
                error={Boolean(formik.touched.blog && formik.errors.blog)}
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
              isDisabled={!formik.isValid || _.isEqual(formik.values, data?.payload?.socials)}
            />
          </Box>
        </CardContent>
      </Card>
    </form>
  )
}

export default Socials
