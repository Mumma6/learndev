import { Container, Grid, Typography } from "@mui/material"
import { Box } from "@mui/material"
import Image from "next/image"
import Link from "next/link"
import React from "react"
import LandingFooter from "./LandingFooter"
import LandingHeader from "./LandingHeader"

const Landing = () => {
  return (
    <>
      <LandingHeader />
      <Container sx={{ mt: 10 }}>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <div>
              <Typography variant="h1" gutterBottom>
                The number one tool for self-taught developers.
              </Typography>
              <Typography variant="h6" gutterBottom>
                The way we learn is changing. In a online world with endless resources it can be overwhelming and hard to
                keep track. We help to bring your vision to life
              </Typography>
            </div>
          </Grid>
          <Grid item xs={6}>
            <Image alt="pic" src="/assets/images/developer.svg" width={500} height={500} />
          </Grid>
        </Grid>
      </Container>
      <Container sx={{ mt: 10 }}>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <Image alt="pic" src="/assets/images/graphs.svg" width={500} height={500} />
          </Grid>
          <Grid item xs={6}>
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
          </Grid>
        </Grid>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <div>
              <Typography variant="h1" gutterBottom>
                The number one tool for self-taught developers.
              </Typography>
              <Typography variant="h6" gutterBottom>
                The way we learn is changing. In a online world with endless resources it can be overwhelming and hard to
                keep track. We help to bring your vision to life
              </Typography>
            </div>
          </Grid>
          <Grid item xs={6}>
            <Image alt="pic" src="/assets/images/product-launch.svg" width={500} height={800} />
          </Grid>
        </Grid>
      </Container>

      <LandingFooter />
    </>
  )
}

export default Landing
