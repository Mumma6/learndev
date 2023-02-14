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
    text: "Plan your studies and work from the calendar. Add events and connect them to a specific course or project. Research shows that students who make learning a habit are more likely to retain information and reach their goals. Set time aside to learn and get reminders using your learning event scheduler.",
    heading: "Calendar",
  },
  {
    image: serviceImage2,
    text: "Get a overview of all your courses, both completed and in progress. Helps you keep track of your studying.",
    heading: "Courses",
  },
  {
    image: serviceImage3,
    text: "Get a complete overview of all your courses, projects, quizzes, upcoming events and much more.",
    heading: "Personal overview",
  },
  {
    image: serviceImage4,
    text: "Get a overview of all your projects, both completed and in progress. Helps you keep track of all your projects.",
    heading: "Projects",
  },
  {
    image: serviceImage5,
    text: "Test your skill and increase your profile with code quizzes.",
    heading: "Quizzes",
  },
  {
    image: serviceImage6,
    text: "Create your own profile and share with recruiters. Show of all your work here.",
    heading: "Profile",
  },
]

const Services = () => {
  return (
    <Box mt={20} mb={20} pt={20} pb={20} style={{ backgroundColor: "#ededed" }}>
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
