import React, { useState, FormEvent } from "react"
import { Box, Alert, Card, CardContent, CardHeader, Divider, TextField, Button } from "@mui/material"
import SubmitButton from "../SubmitButton"
import Chip from "@mui/material/Chip"
import Paper from "@mui/material/Paper"
import Autocomplete from "@mui/material/Autocomplete"
import { Skill, skillsData } from "../../constants/skillsData"
import { FaPlus } from "react-icons/fa"
import { fetcher1 } from "../../lib/axiosFetcher"
import { IUser } from "../../types/user"
import { toast } from "react-toastify"
import { useCurrentUser } from "../../lib/hooks"
import * as _ from "lodash"

const Skills = () => {
  const { data, mutate } = useCurrentUser()
  const [chipData, setChipData] = React.useState<Skill[]>(data?.payload?.skills || [])

  const [newSkill, setNewSkill] = useState<Skill | null>()

  const handleDelete = (chipToDelete: Skill) => () => {
    setChipData((chips) => chips.filter((chip) => chip.label !== chipToDelete.label))
  }

  const handleChange = (e: React.SyntheticEvent, value: Skill | null) => {
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

    try {
      setIsLoading(true)
      const response = await fetcher1<IUser, Pick<IUser, "skills">>("/api/user", {
        headers: { "Content-Type": "application/json" },
        method: "PATCH",
        data: {
          skills: chipData,
        },
      })
      if (response.error) {
        toast.error(response.error)
        setIsLoading(false)
      } else {
        mutate({ payload: response.payload }, false)
        toast.success("Your profile has been updated")
        setIsLoading(false)
      }
    } catch (e) {
      console.error(e)
    }
  }
  const [isLoading, setIsLoading] = useState(false)
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
              }}
            >
              <Autocomplete
                onChange={handleChange}
                disablePortal
                id="combo-box-demo"
                options={skillsData}
                sx={{ width: 300, marginRight: 3 }}
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
                mt: 8,
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
              float: "right",
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
