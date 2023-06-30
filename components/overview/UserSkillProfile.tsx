import React from "react"
import { Radar } from "react-chartjs-2"
import { Box, Card, CardContent, CardHeader, Divider, Typography, useTheme } from "@mui/material"
import CardHeaderTitle from "../shared/CardHeaderTitle"
import { useCurrentUser, useQuizResults } from "../../lib/hooks"

const UserSkillProfile = () => {
  const theme = useTheme()

  const { data: userQuizData } = useQuizResults()
  const { data: userData } = useCurrentUser()
  const userQuizResult = userQuizData?.payload?.filter((p) => p.user_id === userData?.payload?._id)

  // utveckla denna funktion så den tar hänsyn till fler saker för en bättre "viktning"
  // Slå ihop alla resultat inom samma mainTopic. t e x React.
  /*

  Fråga chatGpt. fler quizzes ska ge bättre resultat.

  react1, 80% -> 80
  react2: 60% medianen gånger (x1,2) -> 84    // 70 x 1.2. // 70 eftersom det är mellan 80 och 60
  react3: 50% (x1,3) -> 65
  */

  const getPercentageValue = (score: number, maxScore: number) => {
    return ((score / maxScore) * 100).toFixed()
  }

  // Måste ha minst 3 träffar?
  const mappedResults = userQuizResult?.map((res) => ({
    label: res.title,
    weight: getPercentageValue(res.score, res.maxScore)
  }))

  const data = {
    labels: mappedResults?.map(({ label }) => label),
    datasets: [
      {
        label: "",
        data: mappedResults?.map(({ weight }) => weight),
        backgroundColor: "rgb(205, 187, 255)", // theme.palette.primary.main,
        borderColor: theme.palette.primary.main,
        borderWidth: 2
      }
    ]
  }

  const options = {
    scale: {
      min: 0,
      max: 100,
      fontColor: theme.palette.text.secondary
    },
    plugins: {
      legend: {
        display: false
      }
    },
    maintainAspectRatio: false,
    responsive: true,
    tooltips: {
      backgroundColor: theme.palette.background.paper,
      bodyFontColor: theme.palette.text.secondary,
      borderColor: theme.palette.divider,
      borderWidth: 1,
      enabled: true,
      footerFontColor: theme.palette.text.secondary,
      intersect: false,
      mode: "index",
      titleFontColor: theme.palette.text.primary
    }
  }

  return (
    <Card sx={{ height: "100%" }}>
      <CardHeader
        title={
          <CardHeaderTitle title="Skill Profile" toolTipText="This graph shows your skill profile based quiz results" />
        }
      />
      <Divider />
      <CardContent>
        <div
          style={{
            position: "relative",
            marginLeft: "auto",
            marginRight: "auto",
            height: "20rem",
            width: "20rem"
          }}
        >
          <Radar data={data} options={options} />
        </div>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            pt: 2
          }}
        >
          {mappedResults?.map(({ label, weight }, index) => (
            <Box
              key={index}
              sx={{
                p: 1,
                textAlign: "center"
              }}
            >
              <Typography color="textPrimary" variant="body1">
                {label}
              </Typography>
              <Typography variant="body1">{weight}</Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  )
}

export default UserSkillProfile
