import React from "react"
import { Box, Typography } from "@mui/material"
import { type ISteps } from "./OnBoardingModal"

interface IProps {
  step: ISteps
}

const OnBoardingStep = ({ step }: IProps) => {
  const { title, description, image } = step
  return (
    <Box>
      <Typography mb={4} variant="h3">
        {title}
      </Typography>
      <Box mb={4}>
        {image && (
          <img
            style={{
              maxWidth: "100%",
              maxHeight: "100%"
            }}
            alt="core"
            src={image}
          />
        )}
      </Box>
      <Typography variant="h6">{description}</Typography>
    </Box>
  )
}

export default OnBoardingStep
