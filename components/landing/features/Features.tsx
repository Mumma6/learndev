import React, { useState } from "react"
import { Box, Button, Container, Divider, Grid } from "@mui/material"
import { FaRegCalendarAlt, FaUser } from "react-icons/fa"
import { MdQuiz } from "react-icons/md"
import { AiOutlineFundProjectionScreen } from "react-icons/ai"

/*

Make sure all img are same size

*/

type CoreFeatures = "Profile overview" | "Calendar" | "Courses" | "Project"

const Features = () => {
  const [selected, setSelected] = useState<CoreFeatures>("Profile overview")

  const getVariant = (feature: CoreFeatures) => {
    return feature === selected ? "contained" : "outlined"
  }
  return (
    <Box>
      <Container>
        <Grid mb={4} mt={2} container spacing={2} sx={{ justifyContent: "center" }}>
          <Grid item>
            <Button
              startIcon={<FaUser />}
              variant={getVariant("Profile overview")}
              size="large"
              onClick={() => { setSelected("Profile overview") }}
            >
              Profile overview
            </Button>
          </Grid>
          <Grid item>
            <Button
              startIcon={<FaRegCalendarAlt />}
              variant={getVariant("Calendar")}
              size="large"
              onClick={() => { setSelected("Calendar") }}
            >
              Calendar
            </Button>
          </Grid>
          <Grid item>
            <Button
              startIcon={<AiOutlineFundProjectionScreen />}
              variant={getVariant("Project")}
              size="large"
              onClick={() => { setSelected("Project") }}
            >
              Project
            </Button>
          </Grid>
          <Grid item>
            <Button
              startIcon={<MdQuiz />}
              variant={getVariant("Courses")}
              size="large"
              onClick={() => { setSelected("Courses") }}
            >
              Courses
            </Button>
          </Grid>
        </Grid>
        <Divider sx={{ margin: 2 }} />
        <Box mb={10}>
          {selected === "Profile overview" && (
            <img
              style={{
                maxWidth: "100%",
                maxHeight: "100%"
              }}
              alt="core"
              src="/assets/images/home1.jpg"
            />
          )}
          {selected === "Calendar" && (
            <img
              style={{
                maxWidth: "100%",
                maxHeight: "100%"
              }}
              alt="core"
              src="/assets/images/calendar.jpg"
            />
          )}
          {selected === "Project" && (
            <img
              style={{
                maxWidth: "100%",
                maxHeight: "100%"
              }}
              alt="core"
              src="/assets/images/proj1.jpg"
            />
          )}
          {selected === "Courses" && (
            <img
              style={{
                maxWidth: "100%",
                maxHeight: "100%"
              }}
              alt="core"
              src="/assets/images/mycourses.jpg"
            />
          )}
        </Box>
      </Container>
    </Box>
  )
}

export default Features
