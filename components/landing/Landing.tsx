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
          <Grid sx={{ marginTop: 10 }} container spacing={2}>
            <Grid item xs={12} sm={12} md={6} sx={{ marginTop: "auto", marginBottom: "auto" }}>
              <Typography color="textPrimary" variant="h4" sx={{ fontSize: 34, marginBottom: 10 }}>
                Take control of your learning with Studify: the all-in-one platform for self-taught developers
              </Typography>
              <Box>
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
                The way we learn is changing. In a online world with endless resources it can be overwhelming and hard to
                keep track. We help to bring your vision to life
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
      <Element name="pricing">
        <Pricing />
      </Element>
      <LandingFooter />
    </div>
  )
}

export default Landing
