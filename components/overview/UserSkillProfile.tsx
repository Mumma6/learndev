import React from "react"
import { Radar } from "react-chartjs-2"
import { Box, Card, CardContent, CardHeader, Divider, Typography, useTheme } from "@mui/material"

const UserSkillProfile = () => {
  const theme = useTheme()

  const data = {
    labels: ["Javascript", "React", "CSS", "HTML"],
    datasets: [
      {
        label: "Skillset",
        data: [70, 90, 30, 55],
        backgroundColor: "rgb(205, 187, 255)", // theme.palette.primary.main,
        borderColor: theme.palette.primary.main,
        borderWidth: 2,
      },
    ],
  }

  const options = {
    scale: {
      min: 0,
      max: 100,
      fontColor: theme.palette.text.secondary,
    },
    maintainAspectRatio: true,
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
      titleFontColor: theme.palette.text.primary,
    },
  }

  const mappedData = [
    {
      label: "Javascript",
      number: 70,
    },
    {
      label: "react",
      number: 10,
    },
    {
      label: "html",
      number: 50,
    },
    {
      label: "css",
      number: 30,
    },
  ]
  return (
    <Card sx={{ height: "100%" }}>
      <CardHeader title="Skill overview" />
      <Divider />
      <CardContent>
        <Box
          sx={{
            height: 300,
            position: "relative",
          }}
        >
          <Radar data={data} options={options} />
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            pt: 2,
          }}
        >
          {mappedData.map(({ label, number }, index) => (
            <Box
              key={index}
              sx={{
                p: 1,
                textAlign: "center",
              }}
            >
              <Typography color="textPrimary" variant="body1">
                {label}
              </Typography>
              <Typography variant="body1">{number}</Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  )
}

export default UserSkillProfile
