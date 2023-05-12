import React from "react"
import { IQuestion, IQuiz } from "../../models/Quiz"
import { Box, Alert, Card, Typography, CardHeader, Divider, TextField, Button } from "@mui/material"
import Radio from "@mui/material/Radio"
import RadioGroup from "@mui/material/RadioGroup"
import FormControlLabel from "@mui/material/FormControlLabel"
import FormControl from "@mui/material/FormControl"
import FormLabel from "@mui/material/FormLabel"
import { ISteps } from "./OnBoardingModal"

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
              maxHeight: "100%",
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
