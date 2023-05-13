import React from "react"
import { Container, Grid, Typography, Box } from "@mui/material"

import serviceImage1 from "../../../public/assets/images/service-1.png"
import serviceImage2 from "../../../public/assets/images/service-2.png"
import serviceImage3 from "../../../public/assets/images/service-3.png"
import serviceImage4 from "../../../public/assets/images/service-4.png"
import serviceImage5 from "../../../public/assets/images/service-5.png"
import serviceImage6 from "../../../public/assets/images/service-6.png"
import ServiceCard from "./ServiceCard"

const SERVICES_DATA = [
  {
    image: serviceImage1,
    text: "Get organized and take control of your study schedule with our powerful calendar tool. Plan your learning sessions, set project deadlines, and stay on track to achieve your coding goals.",
    heading: "Calendar",
  },
  {
    image: serviceImage2,
    text: "Studify's course management system lets you easily plan and track your progress. Stay on course towards your goals, manage your resources, and keep a record of all your learning activities.",
    heading: "Courses",
  },
  {
    image: serviceImage3,
    text: "Take control of your coding education with Studify's intuitive dashboard. Analyze your progress, visualize your achievements, and make data-driven decisions to improve your skills.",
    heading: "Personal overview",
  },
  {
    image: serviceImage4,
    text: "Manage your projects efficiently. Keep all your code, notes, and progress in one place with Studify.",
    heading: "Projects",
  },
  {
    image: serviceImage5,
    text: "Studify's built-in quizzes and assessments offer an effective way to test your skills and knowledge. Identify areas of improvement and gain confidence in your coding abilities.",
    heading: "Quizzes",
  },
  {
    image: serviceImage6,
    text: "Create an impressive profile using Studify's integrated tools. Share your learning journey, showcase your skills and projects, and catch the attention of potential recruiters.",
    heading: "Profile",
  },
]

const Services = () => {
  return (
    <Box mt={20} mb={20} pt={10} pb={20} style={{ backgroundColor: "#ededed" }}>
      <Container>
        <Box
          sx={{
            textAlign: "center",
            mb: 15,
          }}
        >
          <p
            style={{
              color: "#0F2137",
              fontSize: 30,
              fontWeight: 700,
              lineHeight: 1,
              marginBottom: 30,
            }}
          >
            Features overview
          </p>
        </Box>
        <Grid mb={4} mt={2} container spacing={2}>
          {SERVICES_DATA.map((service, index) => (
            <Grid key={index} item lg={4} md={4} sm={6} xs={12}>
              <ServiceCard image={service.image} text={service.text} heading={service.heading} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  )
}

export default Services
