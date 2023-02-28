import React from "react"
import { Box, Card, CardContent, CardHeader, Divider, Typography, useTheme } from "@mui/material"
import { Bar } from "react-chartjs-2"

const TopicsChart = () => {
  const theme = useTheme()

  const options = {
    responsive: true,
    legend: {
      display: false,
    },
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
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

  const labels = [
    {
      name: "react",
      number: 5,
    },
    {
      name: "javascript",
      number: 12,
    },
    {
      name: "html",
      number: 8,
    },
    {
      name: "mongodb",
      number: 1,
    },
  ]

  const data = {
    labels: labels.map(({ name }) => name),
    datasets: [
      {
        data: labels.map((label) => label.number),
        backgroundColor: ["#14b8a6", "#7c4dff", "#3F51B5", "#e53935"],

        maxBarThickness: 50,
      },
    ],
  }
  return (
    <Card sx={{ height: "100%" }}>
      <CardHeader title="Topics covered" subheader="Most used techs" />
      <Divider />
      <CardContent>
        <Box
          sx={{
            height: 300,
            position: "relative",
          }}
        >
          <Bar options={options} data={data} />
        </Box>
      </CardContent>
    </Card>
  )
}

export default TopicsChart
