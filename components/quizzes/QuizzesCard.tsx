import React from "react"
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Typography,
} from "@mui/material"
import Rating from "@mui/material/Rating"
import { IQuiz } from "../../models/Quiz"
import { useRouter } from "next/router"
import { useCurrentUser, useQuizResults } from "../../lib/hooks"
import { BsZoomOut } from "react-icons/bs"
import { ChipTypeMap } from "@mui/material/Chip"

interface IProps {
  quiz: IQuiz
}

const QuizzesCard = ({ quiz }: IProps) => {
  const { title, description, difficulty, _id } = quiz
  const router = useRouter()
  const { data } = useCurrentUser()
  const { data: quizResultsData } = useQuizResults()

  const userQuizResult = quizResultsData?.payload
    ?.filter((p) => p.user_id === data?.payload?._id)
    .find((q) => q.quiz_id === _id)

  const getChipProps = (): {
    color:
      | "default"
      | "success"
      | "error"
      | "primary"
      | "secondary"
      | "info"
      | "warning"
      | undefined
    label: string
  } => {
    if (!userQuizResult) {
      return {
        label: "Not taken",
        color: "primary",
      }
    }
    if (userQuizResult?.approved) {
      return {
        label: "Approved",
        color: "success",
      }
    }

    if (!userQuizResult?.approved) {
      return {
        label: "Retry 30 days", // todo. calc correct amount of days
        color: "error",
      }
    }
    return {
      label: "Not taken",
      color: "primary",
    }
  }

  const getAvatarUrl = () => {
    return title.includes("React")
      ? "/assets/images/react-logo.png"
      : "/assets/images/Javascript_Logo.png"
  }
  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <Box
        sx={{
          backgroundColor: !!userQuizResult ? "#cdcdcd" : null,
        }}
      >
        <Button disabled={!!userQuizResult} onClick={() => router.push(`/quizzes/${_id}`)}>
          <CardContent>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                pb: 3,
              }}
            >
              <Avatar
                sx={{ width: 64, height: 64 }}
                alt="Logo"
                src={getAvatarUrl()}
                variant="square"
              />
            </Box>
            <Typography align="center" color="textPrimary" gutterBottom variant="h5">
              {title}
            </Typography>
            <Typography align="center" color="textPrimary" variant="body1">
              {description}
            </Typography>
          </CardContent>
        </Button>
      </Box>
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
          <Grid>
            <Chip sx={{ marginTop: 2 }} {...getChipProps()} />
          </Grid>
        </Grid>
      </Box>
    </Card>
  )
}

export default QuizzesCard
