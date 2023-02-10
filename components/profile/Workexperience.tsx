import { useEffect, useState, FormEvent } from "react"
import Box from "@mui/material/Box"
import Card from "@mui/material/Card"
import { Button, CardHeader, Divider, Typography } from "@mui/material"
import WorkexperienceCard from "./WorkexperienceCard"
import { FaPlus } from "react-icons/fa"
import SubmitButton from "../SubmitButton"
import { useCurrentUser } from "../../lib/hooks"
import WorkexperienceModal from "./WorkexperienceModal"
import { fetcher1 } from "../../lib/axiosFetcher"
import { toast } from "react-toastify"
import * as _ from "lodash"
import { UserModelSchemaType, UserWorkexperienceSchema, UserWorkexperienceSchemaType } from "../../schema/UserSchema"
import { useZodFormValidation } from "../customHooks/useZodFormValidation"

// Använd formink här istället.
export const initialFormState: UserWorkexperienceSchemaType = {
  role: "",
  company: "",
  startDate: "",
  endDate: "",
  currentJob: false,
  description: "",
}

const Workexperience = () => {
  const { data, mutate } = useCurrentUser()

  const [open, setOpen] = useState(false)
  const [workexperience, setWorkexperience] = useState(data?.payload?.workexperience || [])

  const { values, setValues, errors, setFieldValue } = useZodFormValidation<UserWorkexperienceSchemaType>(
    UserWorkexperienceSchema,
    initialFormState
  )

  /*
  const [workexperienceFormData, setWorkexperienceFormData] = useState<UserWorkexperienceSchemaType>(initialFormState)
  */
  const [isLoading, setIsLoading] = useState(false)

  const onAddWorkexperience = () => {
    setWorkexperience((prev) => [...prev, values])
    setValues(initialFormState)
    handleClose()
  }

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setValues(initialFormState)
    setOpen(false)
  }

  const deleteWorkexperience = (workexperience: UserWorkexperienceSchemaType) => {
    setWorkexperience((state) =>
      state.filter((w) => w.company !== workexperience.company && w.description !== workexperience.description)
    )
  }

  const cardTitleNode = (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <Typography
        sx={{
          fontSize: "0.875rem",
          fontWeight: 400,
          lineHeight: 1.57,
        }}
      >
        Add any relevant work experience
      </Typography>
      <Button
        onClick={handleClickOpen}
        sx={{
          fontSize: 24,
          top: -25,
        }}
      >
        <FaPlus />
      </Button>
    </Box>
  )

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      setIsLoading(true)
      const response = await fetcher1<UserModelSchemaType, Pick<UserModelSchemaType, "workexperience">>("/api/user", {
        headers: { "Content-Type": "application/json" },
        method: "PATCH",
        data: {
          workexperience,
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
        <CardHeader
          sx={{
            paddingBottom: 2,
          }}
          subheader={cardTitleNode}
          title="Work experience"
        />
        <Divider />
        <WorkexperienceModal
          open={open}
          handleClose={handleClose}
          formValues={values}
          setFieldValue={setFieldValue}
          errors={errors}
          onAddWorkexperience={onAddWorkexperience}
        />
        <Box pt={1} pb={2} px={2}>
          <Box component="ul" display="flex" flexDirection="column" p={0} m={0}>
            {workexperience.map((work, index) => (
              <WorkexperienceCard key={index} work={work} deleteWorkexperience={deleteWorkexperience} />
            ))}
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
            text="Update work experience"
            isLoading={isLoading}
            isDisabled={_.isEqual(workexperience, data?.payload?.workexperience)}
          />
        </Box>
      </Card>
    </form>
  )
}

export default Workexperience
