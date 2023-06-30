import React, { type FormEvent, useState } from "react"
import { Box, Button, Card, CardContent, CardHeader, Divider, TextField } from "@mui/material"
import SubmitButton from "../shared/SubmitButton"
import Chip from "@mui/material/Chip"
import Paper from "@mui/material/Paper"
import Autocomplete from "@mui/material/Autocomplete"
import { skillsData } from "../../constants/skillsData"
import { FaPlus } from "react-icons/fa"
import { fetcherTE } from "../../lib/axiosFetcher"
import { pipe } from "fp-ts/function"
import * as TE from "fp-ts/TaskEither"
import { toast } from "react-toastify"
import { useCurrentUser } from "../../lib/hooks"
import * as _ from "lodash"
import { type UserModelSchemaType } from "../../schema/UserSchema"
import { type SkillSchemaType } from "../../schema/SharedSchema"
import { useSWRConfig } from "swr"

const Skills = () => {
  const { data } = useCurrentUser()
  const { mutate } = useSWRConfig()
  const [isLoading, setIsLoading] = useState(false)
  const [chipData, setChipData] = React.useState<SkillSchemaType[]>(data?.payload?.skills || [])

  const [newSkill, setNewSkill] = useState<SkillSchemaType | null>()

  const handleDelete = (chipToDelete: SkillSchemaType) => () => {
    setChipData((chips) => chips.filter((chip) => chip.label !== chipToDelete.label))
  }

  const handleChange = (e: React.SyntheticEvent, value: SkillSchemaType | null) => {
    setNewSkill(value)
  }

  const addNewskill = () => {
    if (newSkill) {
      setChipData((data) => [...data, newSkill])
      setNewSkill(null)
    }
  }

  const isDisabled = () => {
    if (!newSkill) {
      return true
    }

    const usedLabels = chipData.map(({ label }) => label)

    if (usedLabels.includes(newSkill.label)) {
      return true
    }

    return false
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    pipe(
      fetcherTE<UserModelSchemaType, Pick<UserModelSchemaType, "skills">>("/api/user", {
        headers: { "Content-Type": "application/json" },
        method: "PATCH",
        data: {
          skills: chipData
        }
      }),
      TE.fold(
        (error) => {
          toast.error(error)
          setIsLoading(false)
          return TE.left(error)
        },
        (data) => {
          mutate("/api/user")
          toast.success("Your profile has been updated")
          setIsLoading(false)
          return TE.right(data)
        }
      )
    )()
  }

  return (
    <>
      <form onSubmit={onSubmit}>
        <Card>
          <CardHeader subheader="Add your skills in order of proficency" title="Skills" />
          <Divider />
          <CardContent>
            <Box
              sx={{
                display: "flex",
                justifyContent: "start",
                flexWrap: "wrap",
                listStyle: "none",
                paddingBottom: !chipData.length ? 5 : 0
              }}
            >
              <Autocomplete
                onChange={handleChange}
                disablePortal
                id="combo-box-demo"
                options={skillsData}
                sx={{ width: 400, marginRight: 2 }}
                renderInput={(params) => <TextField {...params} label="Skill" />}
              />
              <Button onClick={addNewskill} style={{ fontSize: 20 }} disabled={isDisabled()}>
                <FaPlus />
              </Button>
            </Box>

            <Paper
              sx={{
                display: "flex",
                justifyContent: "start",
                flexWrap: "wrap",
                listStyle: "none",
                p: 0.5,
                mt: 8
              }}
              component="ul"
            >
              {chipData.map((data) => (
                <Chip
                  key={data.label}
                  color="primary"
                  style={{ margin: 4 }}
                  label={data.label}
                  onDelete={handleDelete(data)}
                />
              ))}
            </Paper>
          </CardContent>
          <Divider />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              p: 2,
              float: "right"
            }}
          >
            <SubmitButton
              customStyle={{ margin: 1 }}
              color="success"
              fullWidth={false}
              size={"medium"}
              text="Update skills"
              isLoading={isLoading}
              isDisabled={_.isEqual(chipData, data?.payload?.skills)}
            />
          </Box>
        </Card>
      </form>
    </>
  )
}

export default Skills
