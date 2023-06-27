import React from "react"
import { Doughnut } from "react-chartjs-2"
import { Box, Card, CardContent, CardHeader, Divider, Typography, useTheme } from "@mui/material"
import { type CourseModelSchemaType } from "../../schema/CourseSchema"
import CardHeaderTitle from "../shared/CardHeaderTitle"
import { colors } from "../../constants/colors"
import { pipe } from "fp-ts/function"
import * as A from "fp-ts/Array"
import * as O from "fp-ts/Option"
import type * as Record from "fp-ts/Record"

interface IProps {
  courses: CourseModelSchemaType[] | null | undefined
}

const getAmountOfProviders = (courses: CourseModelSchemaType[] | null | undefined) =>
  pipe(
    courses,
    O.fromNullable,
    O.fold(
      () => [],
      (_courses) =>
        pipe(
          _courses,
          A.reduce({}, (total: Record<string, number>, course) => ({
            ...total,
            [course.content.institution]: (total[course.content.institution] || 0) + 1
          })),
          Object.entries,
          A.mapWithIndex((index, [institution, count]) => ({
            institution,
            count,
            color: colors[index % colors.length],
            percentage: Math.round((count / A.size(_courses)) * 100)
          }))
        )
    )
  )

const CoursesByProvider = ({ courses }: IProps) => {
  const amountOfProviders = getAmountOfProviders(courses)
  const theme = useTheme()

  const data = {
    datasets: [
      {
        data: amountOfProviders.map(({ count }) => count),
        backgroundColor: colors,
        borderWidth: 8,
        borderColor: "#FFFFFF",
        hoverBorderColor: "#FFFFFF"
      }
    ],
    labels: amountOfProviders.map(({ institution }) => institution)
  }

  const options = {
    cutoutPercentage: 80,
    layout: { padding: 0 },
    legend: {
      display: false
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
          <CardHeaderTitle
            title="Course Distribution by Provider"
            toolTipText="This graph shows the number of courses you have from each provider. This will give you an overview of your favorit learning resource"
          />
        }
      />
      <Divider />
      <CardContent>
        <Box
          sx={{
            height: 300,
            position: "relative"
          }}
        >
          <Doughnut data={data} options={options} />
        </Box>
        <Box sx={{ textAlign: "center", paddingTop: 3 }}>
          <Typography variant="body1">Top 5</Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            pt: 2
          }}
        >
          {!amountOfProviders.length && (
            <Typography color="textPrimary" variant="body1">
              No courses
            </Typography>
          )}

          {amountOfProviders
            .sort((a, b) => b.percentage - a.percentage)
            .slice(0, 4)
            .map(({ color, institution, percentage }) => (
              <Box
                key={institution}
                sx={{
                  p: 1,
                  textAlign: "center"
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
