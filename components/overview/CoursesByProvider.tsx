import React from "react"
import { Doughnut } from "react-chartjs-2"
import { Box, Card, CardContent, CardHeader, Divider, Typography, useTheme } from "@mui/material"

const CoursesByProvider = () => {
  const theme = useTheme()

  const data = {
    datasets: [
      {
        data: [63, 15, 22],
        backgroundColor: ["#3F51B5", "#e53935", "#FB8C00"],
        borderWidth: 8,
        borderColor: "#FFFFFF",
        hoverBorderColor: "#FFFFFF",
      },
    ],
    labels: ["Udemy", "Pluralsight", "Youtube"],
  }

  const options = {
    cutoutPercentage: 80,
    layout: { padding: 0 },
    legend: {
      display: false,
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
      titleFontColor: theme.palette.text.primary,
    },
  }

  const devices = [
    {
      title: "Udemy",
      value: 63,
      color: "#3F51B5",
    },
    {
      title: "Pluralsight",
      value: 15,
      color: "#E53935",
    },
    {
      title: "Youtube",
      value: 23,
      color: "#FB8C00",
    },
  ]
  return (
    <Card sx={{ height: "100%" }}>
      <CardHeader title="Courses by provider" />
      <Divider />
      <CardContent>
        <Box
          sx={{
            height: 300,
            position: "relative",
          }}
        >
          <Doughnut data={data} options={options} />
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            pt: 2,
          }}
        >
          {devices.map(({ color, title, value }) => (
            <Box
              key={title}
              sx={{
                p: 1,
                textAlign: "center",
              }}
            >
              <Typography color="textPrimary" variant="body1">
                {title}
              </Typography>
              <Typography style={{ color }} variant="h4">
                {value}%
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  )
}

export default CoursesByProvider
