import React from "react"
import { Doughnut } from "react-chartjs-2"
import { Box, Card, CardContent, CardHeader, Divider, Typography, useTheme } from "@mui/material"
import { CourseModelSchemaType } from "../../schema/CourseSchema"
import CardHeaderTitle from "../shared/CardHeaderTitle"

type InstitutionCount = {
  [key: string]: number
}

interface IProps {
  courses: CourseModelSchemaType[] | null | undefined
}

const colors = ["#3F51B5", "#e53935", "#FB8C00", "green"]

const CoursesByProvider = ({ courses }: IProps) => {
  const getAmountOfProviders = () => {
    if (!courses) {
      return []
    }
    const total = courses.reduce((total: InstitutionCount, course: CourseModelSchemaType) => {
      total[course.content.institution] = total[course.content.institution] ? total[course.content.institution] + 1 : 1
      return total
    }, {})

    const totalCount = courses.length

    return Object.entries(total).map(([institution, count], i) => ({
      institution,
      count,
      color: colors[i],
      percentage: Math.round((count / totalCount) * 100),
    }))
  }

  console.log(getAmountOfProviders())

  const amountOfProviders = getAmountOfProviders()

  const theme = useTheme()

  const data = {
    datasets: [
      {
        data: amountOfProviders.map(({ count }) => count),
        backgroundColor: ["#3F51B5", "#e53935", "#FB8C00", "green"],
        borderWidth: 8,
        borderColor: "#FFFFFF",
        hoverBorderColor: "#FFFFFF",
      },
    ],
    labels: amountOfProviders.map(({ institution }) => institution),
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

  return (
    <Card sx={{ height: "100%" }}>
      <CardHeader
        title={
          <CardHeaderTitle
            title="Courses by provider"
            toolTipText="This graph shows the number of courses you have from each provider. This will give you an overview of your favorit learning resource"
          />
        }
      />
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
          {!amountOfProviders.length && (
            <Typography color="textPrimary" variant="body1">
              No courses
            </Typography>
          )}
          {amountOfProviders.map(({ color, institution, percentage }) => (
            <Box
              key={institution}
              sx={{
                p: 1,
                textAlign: "center",
              }}
            >
              <Typography color="textPrimary" variant="body1">
                {institution}
              </Typography>
              <Typography style={{ color }} variant="body1">
                {percentage}%
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  )
}

export default CoursesByProvider
