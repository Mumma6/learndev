import React from "react"
import { Box, Card, CardContent, CardHeader, Divider, Typography, Avatar } from "@mui/material"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import Paper from "@mui/material/Paper"
import { styled } from "@mui/material/styles"

import LinearProgress, { linearProgressClasses } from "@mui/material/LinearProgress"

const getBackgroundColor = (theme: any, value: number | undefined) => {
  if (!value) {
    return undefined
  }
  if (value > 50) {
    return theme.palette.success.main
  } else {
    return theme.palette.error.main
  }
}

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

const LatestQuizResults = () => {
  return (
    <Card sx={{ height: "100%" }}>
      <CardHeader title="Latest quizzes" />
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
            <TableBody>
              <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                <TableCell component="th" scope="row">
                  <Box sx={{ display: "flex" }}>
                    <Avatar sx={{ width: 24, height: 24 }} alt="JS Logo" src="/assets/images/Javascript_Logo.png" />
                    <Typography ml={1}>Javascript</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box>
                    <Box>
                      <BorderLinearProgress variant="determinate" value={80} />
                    </Box>
                  </Box>
                </TableCell>
              </TableRow>
              <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                <TableCell component="th" scope="row">
                  <Box sx={{ display: "flex" }}>
                    <Avatar sx={{ width: 24, height: 24 }} alt="JS Logo" src="/assets/images/react-logo.png" />
                    <Typography ml={1}>React</Typography>
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <BorderLinearProgress variant="determinate" value={30} />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  )
}

export default LatestQuizResults
