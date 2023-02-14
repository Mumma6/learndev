import React from "react"
import { Container, Grid, Typography, Box } from "@mui/material"
import PricingCard from "./PricingCard"

const DATA = [
  {
    id: 1,
    price: 0,
    isRecommended: false,
    type: "Free",
    subTitle: "Start a free 30 day trial",
    buttonText: "Start 30 day trial",
    features: [
      {
        id: 1,
        isAvailable: true,
        title: "Ultimate access to all course, exercises and assessments",
      },
      {
        id: 2,
        isAvailable: true,
        title: `Free access for all kind of exercise corrections with downloads.`,
      },
      {
        id: 3,
        isAvailable: true,
        title: `Total assessment corrections with free download access system`,
      },
      {
        id: 4,
        isAvailable: false,
        title: "More features are coming soon",
      },
      {
        id: 5,
        isAvailable: false,
        title: "More features are coming soon",
      },
    ],
  },
  {
    id: 2,
    price: 14.99,
    specialOffer: 0,
    type: "Premium",
    isRecommended: true,
    buttonText: "Subscribe now",
    subTitle: "Special offer",
    features: [
      {
        id: 1,
        isAvailable: true,
        title: "Ultimate access to all course, exercises and assessments",
      },
      {
        id: 2,
        isAvailable: true,
        title: `Free access for all kind of exercise corrections with downloads.`,
      },
      {
        id: 3,
        isAvailable: true,
        title: `Total assessment corrections with free download access system`,
      },
      {
        id: 4,
        isAvailable: true,
        title: "More features are coming soon",
      },
      {
        id: 5,
        isAvailable: true,
        title: "More features are coming soon",
      },
    ],
  },
]

const Pricing = () => {
  return (
    <Box mb={10}>
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
            Pricing
          </p>
          <p
            style={{
              lineHeight: 1,
              fontSize: 20,
              color: "#858B91",
            }}
          >
            Create your account here. Choose what plan suits you.
          </p>
        </Box>
        <Grid container spacing={3}>
          {DATA.map((data) => (
            <Grid item xs={2} sm={6} md={6}>
              <PricingCard data={data} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  )
}

export default Pricing