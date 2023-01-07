import React from "react"
import { Avatar, Box, Button, Card, CardContent, Divider, Grid, Typography } from "@mui/material"
import Rating from "@mui/material/Rating"
import { IQuiz } from "../../models/Quiz"
import { useRouter } from "next/router"
import { useCurrentUser } from "../../lib/hooks"

interface IProps {
  quiz: IQuiz
}

const QuizzesCard = ({ quiz }: IProps) => {
  const { title, description, difficulty, _id } = quiz
  const router = useRouter()
  const { data } = useCurrentUser()

  const quizTaken = data?.payload?.completedQuizzes?.includes(_id)

  const getAvatarUrl = () => {
    return title.includes("React") ? "/assets/images/react-logo.png" : "/assets/images/Javascript_Logo.png"
  }
  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        backgroundColor: quizTaken ? "#cdcdcd" : null,
      }}
    >
      <Button disabled={quizTaken} onClick={() => router.push(`/quizzes/${_id}`)}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              pb: 3,
            }}
          >
            <Avatar sx={{ width: 64, height: 64 }} alt="Logo" src={getAvatarUrl()} variant="square" />
          </Box>
          <Typography align="center" color="textPrimary" gutterBottom variant="h5">
            {title}
          </Typography>
          <Typography align="center" color="textPrimary" variant="body1">
            {description}
          </Typography>
        </CardContent>
      </Button>
      <Box sx={{ flexGrow: 1 }} />
      <Divider />
      <Box sx={{ p: 2 }}>
        <Grid container spacing={2} sx={{ justifyContent: "space-between" }}>
          <Grid
            item
            sx={{
              alignItems: "center",
              display: "flex",
            }}
          >
            <Typography component="legend">Difficulty:</Typography>
            <Rating max={3} name="read-only" value={difficulty} readOnly />
          </Grid>
        </Grid>
      </Box>
    </Card>
  )
}

export default QuizzesCard
