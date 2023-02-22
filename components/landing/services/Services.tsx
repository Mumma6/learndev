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
    text: "Get organized and take control of your study schedule with our powerful calendar tool. Plan your sessions, set deadlines, and stay on track to achieve your goals",
    heading: "Calendar",
  },
  {
    image: serviceImage2,
    text: "Take control of your learning with Studify's course management system. Easily plan your studies and stay on track towards your goals",
    heading: "Courses",
  },
  {
    image: serviceImage3,
    text: "Take control of your coding education with Studify's powerful dashboard. Analyze your progress and make data-driven decisions to improve your skills",
    heading: "Personal overview",
  },
  {
    image: serviceImage4,
    text: "Manage your coding projects with ease using Studify. Keep all your code, notes, and progress in one place",
    heading: "Projects",
  },
  {
    image: serviceImage5,
    text: "Test your skills and knowledge with Studify's built-in quizzes and assessments",
    heading: "Quizzes",
  },
  {
    image: serviceImage6,
    text: "Elevate your profile and share it with recruiters using Studify's integrated job search tools",
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
            What the features of product
          </p>
          <p
            style={{
              lineHeight: 1,
              fontSize: 20,
              color: "#858B91",
            }}
          >
            Features are highlighted here
          </p>
        </Box>
        <Grid mb={4} mt={2} container spacing={2}>
          {SERVICES_DATA.map((service, index) => (
            <Grid item lg={4} md={4} sm={6} xs={12}>
              <ServiceCard image={service.image} text={service.text} heading={service.heading} key={index} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  )
}

export default Services
