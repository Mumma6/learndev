import React from "react"
import { Box, Card, CardContent, CardHeader, Divider, Typography, Avatar } from "@mui/material"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import Paper from "@mui/material/Paper"
import { Theme, styled } from "@mui/material/styles"
import LinearProgress, { linearProgressClasses } from "@mui/material/LinearProgress"
import CardHeaderTitle from "../shared/CardHeaderTitle"
import { IQuizResult } from "../../models/QuizResult"
import { pipe } from "fp-ts/function"
import * as O from "fp-ts/Option"

const getBackgroundColor = (theme: Theme, value: number | undefined) =>
  pipe(
    O.fromNullable(value),
    O.fold(
      () => undefined,
      (v) => (v > 50 ? theme.palette.success.main : theme.palette.error.main)
    )
  )

const BorderLinearProgress = styled(LinearProgress)(({ theme, value }) => ({
  height: 7,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === "light" ? getBackgroundColor(theme, value) : "#308fe8",
  },
}))

interface IProps {
  quizResults: IQuizResult[]
}

const LatestQuizResults = ({ quizResults }: IProps) => {
  // Make this into a helper function
  const getAvatarUrl = (title: string) => {
    if (title.includes("React")) {
      return "/assets/images/react-logo.png"
    }

    if (title.includes("Javascript")) {
      return "/assets/images/Javascript_Logo.png"
    }

    if (title.includes("CSS")) {
      return "/assets/images/css-logo.png"
    }

    if (title.includes("HTML")) {
      return "/assets/images/html-logo.png"
    }
    return title.includes("React") ? "/assets/images/react-logo.png" : "/assets/images/Javascript_Logo.png"
  }

  const getPercentageValue = (score: number, maxScore: number) => (score / maxScore) * 100

  const createRow = (result: IQuizResult) => (
    <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
      <TableCell component="th" scope="row">
        <Box sx={{ display: "flex" }}>
          <Avatar sx={{ width: 24, height: 24 }} alt="JS Logo" src={getAvatarUrl(result.title)} />
          <Typography ml={1}>{result.title}</Typography>
        </Box>
      </TableCell>
      <TableCell>
        <Box>
          <Box>
            <BorderLinearProgress variant="determinate" value={getPercentageValue(result.score, result.maxScore)} />
          </Box>
        </Box>
      </TableCell>
    </TableRow>
  )

  return (
    <Card sx={{ height: "100%" }}>
      <CardHeader
        title={<CardHeaderTitle title="Recent Quiz Performance" toolTipText="This graph shows your latest quiz results" />}
      />
      <Divider />
      <CardContent>
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Quiz name</TableCell>
                <TableCell align="right">Score</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{quizResults.map((result) => createRow(result))}</TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  )
}

export default LatestQuizResults
