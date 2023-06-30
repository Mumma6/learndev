import React from "react"
import { type IQuestion } from "../../models/Quiz"
import { Card, CardContent, CardHeader } from "@mui/material"
import Radio from "@mui/material/Radio"
import RadioGroup from "@mui/material/RadioGroup"
import FormControlLabel from "@mui/material/FormControlLabel"
import FormControl from "@mui/material/FormControl"
import FormLabel from "@mui/material/FormLabel"

interface IProps {
  question: IQuestion
  choosenAnwserKey: number | null
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const Question = ({ question, choosenAnwserKey, handleChange }: IProps) => {
  // flytta denna logik till Quiz.

  const { text, answers, correctAnswer } = question
  return (
    <Card>
      <CardHeader title={text} />
      <CardContent>
        <FormControl>
          <FormLabel id="demo-radio-buttons-group-label">Answer</FormLabel>
          <RadioGroup
            aria-labelledby="demo-controlled-radio-buttons-group"
            name="controlled-radio-buttons-group"
            value={choosenAnwserKey}
            onChange={handleChange}
          >
            {answers.map((answer) => (
              <FormControlLabel key={answer.key} value={answer.key} control={<Radio />} label={answer.text} />
            ))}
          </RadioGroup>
        </FormControl>
      </CardContent>
    </Card>
  )
}

export default Question
