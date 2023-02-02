import { Container, Grid, Typography } from "@mui/material"
import { Box } from "@mui/material"
import Image from "next/image"
import Link from "next/link"
import React from "react"
import Features from "./features/Features"
import LandingFooter from "./LandingFooter"
import LandingHeader from "./LandingHeader"
import Services from "./services/Services"

const Landing = () => {
  return (
    <>
      <LandingHeader />
      <Container sx={{ width: 800, mt: 10 }}>
        <Box
          sx={{
            textAlign: "center",
            mb: 5,
          }}
        >
          <p
            style={{
              color: "#0F2137",
              fontSize: 64,
              fontWeight: 700,
              lineHeight: 1.25,
            }}
          >
            The number one tool for self-taught developers.
          </p>
          <p
            style={{
              marginTop: 80,
              lineHeight: 1,
              fontSize: 20,
              color: "#858B91",
            }}
          >
            The way we learn is changing. In a online world with endless resources it can be overwhelming and hard to keep
            track. We help to bring your vision to life.
          </p>
          <p
            style={{
              lineHeight: 1,
              fontSize: 20,
              color: "#858B91",
            }}
          >
            There are many sites that teach you how to program. This page ties them all together. As well as getting ready
            for a job
          </p>
        </Box>
      </Container>
      <Container>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <Image alt="pic" src="/assets/images/developer.svg" width={500} height={500} />
          </Grid>
          <Grid item xs={6}>
            <Image alt="pic" src="/assets/images/graphs.svg" width={500} height={500} />
          </Grid>
        </Grid>

        <Services />
        <Features />
      </Container>

      <LandingFooter />
    </>
  )
}

export default Landing

/*
 <Grid item xs={6}>
            <Image alt="pic" src="/assets/images/product-launch.svg" width={500} height={800} />
          </Grid>


          <div>
              <Typography variant="h1" gutterBottom>
                Keep track of your progress.
              </Typography>
              <Typography variant="h6" gutterBottom>
                There are many sites that teach you how to program. This page ties them all together. As well as getting
                ready for a job
              </Typography>
              <Typography variant="h6" gutterBottom>
                One course is rarely enough. It takes several. Show recruiters that you had a thought and plan with your
                courses.
              </Typography>
            </div>

*/
