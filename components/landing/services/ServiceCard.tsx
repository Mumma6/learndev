import { Box, Typography } from "@mui/material"
import React from "react"
import Image from "next/image"

const styles = {
  serviceCard: {
    display: "flex",
    flexDirection: "column",
    textAlign: "center",
  },
  image: {
    flexShrink: 0,
  },
  content: {
    ml: ["0", null, null, "30px"],
    mt: ["20px", null, null, "0px"],
    h3: {
      color: "#0F2137",
      fontWeight: 700,
      fontSize: "18px",
      lineHeight: 1,
    },
    p: {
      fontSize: "16px",
      lineHeight: 1.87,
      color: "#343D48",
      mt: "20px",
      mb: "20px",
    },
  },
}

interface IProps {
  image: any
  text: string
  heading: string
}

const ServiceCard = ({ image, text, heading }: IProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        textAlign: "left",
      }}
    >
      <Box
        sx={{
          flexShrink: 0,
        }}
      >
        <Image alt={heading} src={image} />
      </Box>
      <Box
        style={{
          marginLeft: 30,
        }}
      >
        <p
          style={{
            color: "#0F2137",
            fontWeight: 700,
            fontSize: "18px",
            lineHeight: 1,
          }}
        >
          {heading}
        </p>
        <p
          style={{
            fontSize: "16px",
            lineHeight: 1.87,
            color: "#343D48",
          }}
        >
          {text}
        </p>
      </Box>
    </Box>
  )
}

export default ServiceCard
