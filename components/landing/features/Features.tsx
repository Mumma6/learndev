import React, { useState } from "react"
import { Container, Grid, Typography, Box, Button, Divider } from "@mui/material"
import { FaRegCalendarAlt, FaUser } from "react-icons/fa"
import { MdQuiz } from "react-icons/md"
import { AiOutlineFundProjectionScreen } from "react-icons/ai"
import Image from "next/image"
import overviewImg from "../../../public/assets/images/overview.png"
import calendarImg from "../../../public/assets/images/calendar.png"

/*

Make sure all img are same size

*/

type CoreFeatures = "Profile overview" | "Calendar" | "Courses & Projects" | "Quizzes"

const Features = () => {
  const [selected, setSelected] = useState<CoreFeatures>("Profile overview")

  const getVariant = (feature: CoreFeatures) => {
    return feature === selected ? "contained" : "outlined"
  }
  return (
    <Box>
      <Container>
        <Box
          sx={{
            textAlign: "center",
            mb: 5,
            mt: 10,
          }}
        >
          <p
            style={{
              color: "#0F2137",
              fontSize: 30,
              fontWeight: 700,
              lineHeight: 1,
            }}
          >
            What are the core features
          </p>
          <p
            style={{
              lineHeight: 1,
              fontSize: 20,
              color: "#858B91",
            }}
          >
            Features overview
          </p>
        </Box>
        <Grid mb={4} mt={2} container spacing={2} sx={{ justifyContent: "center" }}>
          <Grid item>
            <Button
              startIcon={<FaUser />}
              variant={getVariant("Profile overview")}
              size="large"
              onClick={() => setSelected("Profile overview")}
            >
              Profile overview
            </Button>
          </Grid>
          <Grid item>
            <Button
              startIcon={<FaRegCalendarAlt />}
              variant={getVariant("Calendar")}
              size="large"
              onClick={() => setSelected("Calendar")}
            >
              Calendar
            </Button>
          </Grid>
          <Grid item>
            <Button
              startIcon={<AiOutlineFundProjectionScreen />}
              variant={getVariant("Courses & Projects")}
              size="large"
              onClick={() => setSelected("Courses & Projects")}
            >
              Courses & Projects
            </Button>
          </Grid>
          <Grid item>
            <Button
              startIcon={<MdQuiz />}
              variant={getVariant("Quizzes")}
              size="large"
              onClick={() => setSelected("Quizzes")}
            >
              Quizzes
            </Button>
          </Grid>
        </Grid>
        <Divider sx={{ margin: 2 }} />
        <Box mb={10}>
          {selected === "Profile overview" && (
            <img
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
              }}
              alt="core"
              src="/assets/images/calendar.png"
            />
          )}
          {selected === "Calendar" && (
            <img
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
              }}
              alt="core"
              src="/assets/images/calendar.png"
            />
          )}
          {selected === "Courses & Projects" && (
            <img
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
              }}
              alt="core"
              src="/assets/images/calendar.png"
            />
          )}
          {selected === "Quizzes" && (
            <img
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
              }}
              alt="core"
              src="/assets/images/calendar.png"
            />
          )}
        </Box>
      </Container>
    </Box>
  )
}

export default Features
