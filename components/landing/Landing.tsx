import { Button, Container, Grid, Typography } from "@mui/material"
import { Box } from "@mui/material"
import Image from "next/image"
import Link from "next/link"
import React from "react"
import Features from "./features/Features"
import LandingFooter from "./LandingFooter"
import LandingHeader from "./LandingHeader"
import Pricing from "./pricing/Pricing"
import Services from "./services/Services"
import { styled } from "@mui/material/styles"
import Scroll, { Link as ScrollLink } from "react-scroll"

/*

Sälj pitches

Every developer should learn and develop their skill. Regardless if you have worked for a couple of years or are just learning this app can help you.

*/

const Landing = () => {
  const Element = Scroll.Element

  return (
    <div style={{ backgroundColor: "#ffffff" }}>
      <LandingHeader />
      <Container sx={{ paddingTop: 20 }}>
        <Box
          sx={{
            textAlign: "center",
            mb: 5,
          }}
        >
          <Typography color="textPrimary" variant="h4" sx={{ fontSize: 64 }}>
            Simplify Your Learning Journey with <span style={{ color: "#7c4dff" }}>Studify</span>
          </Typography>
          <Grid sx={{ marginTop: 1 }} container spacing={2}>
            <Grid item xs={12} sm={12} md={6} sx={{ marginTop: "auto", marginBottom: "auto" }}>
              <Typography color="textPrimary" variant="h4" sx={{ fontSize: 34, marginBottom: 10 }}>
                Unlock your potential: the all-in-one platform for self-taught developers.
              </Typography>
              <Box>
                {/*
<ScrollLink smooth to="pricing">
                  <Button
                    sx={{
                      fontSize: 30,
                    }}
                    size="large"
                    color="secondary" // primary
                    variant="contained"
                  >
                    Get started
                  </Button>
                </ScrollLink>
                */}

                <Link style={{ textDecoration: "none" }} href="/sign-up" passHref>
                  <Button
                    sx={{
                      fontSize: 30,
                    }}
                    size="large"
                    color="secondary"
                    variant="contained"
                  >
                    Get started
                  </Button>
                </Link>
              </Box>
            </Grid>
            <Grid sx={{ marginTop: 5 }} item xs={12} sm={12} md={6}>
              <img
                alt="pic"
                src="/assets/images/details-4.png"
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  height: 500,
                }}
              />
            </Grid>
            <Grid sx={{ marginTop: 5 }} item xs={12} sm={12} md={6}>
              <img
                alt="pic"
                src="/assets/images/details-1.png"
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  height: 500,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} sx={{ display: "flex", alignItems: "center" }}>
              <Typography color="textPrimary" variant="h4" sx={{ fontSize: 34 }}>
                In an online world with endless resources, it can be overwhelming to keep track. We bring your learning
                vision to life, providing the tools to organize and control your self-guided coding education.
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Container>
      <Element name="services">
        <Services />
      </Element>
      <Element name="features">
        <Features />
      </Element>
      {/*
        <Element name="pricing">
        <Pricing />
      </Element>
      */}

      <LandingFooter />
    </div>
  )
}

export default Landing
