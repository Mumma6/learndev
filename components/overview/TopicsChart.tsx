import React from "react"
import { Box, Card, CardContent, CardHeader, Divider, useTheme } from "@mui/material"
import { Bar } from "react-chartjs-2"
import CardHeaderTitle from "../shared/CardHeaderTitle"
import { pipe } from "fp-ts/function"
import * as A from "fp-ts/Array"
import * as O from "fp-ts/Option"
import { type CourseModelSchemaType } from "../../schema/CourseSchema"
import { type ProjectModelType } from "../../schema/ProjectSchema"

interface IProps {
  courses: CourseModelSchemaType[] | null | undefined
  projects: ProjectModelType[] | null | undefined
}

const TopicsChart = ({ courses, projects }: IProps) => {
  const theme = useTheme()

  type Total = Record<string, number>

  const topicsOccurrences = pipe(
    projects?.flatMap((project) => project.techStack.map((tech) => tech.label)),
    O.fromNullable,
    O.chain((a1) =>
      pipe(
        courses?.map((course) => course.topics.map((topic) => topic.label)).flat(),
        O.fromNullable,
        O.map((a2) => A.concat(a1)(a2))
      )
    ),
    O.fold(
      () => [],
      (data) => data
    )
  )

  const getNumberOfOccurrences = (list: string[]) =>
    list.reduce((total: Total, skill: string) => {
      total[skill] = total[skill] ? total[skill] + 1 : 1
      return total
    }, {})

  const mappedOccurrences = pipe(
    topicsOccurrences,
    getNumberOfOccurrences,
    Object.entries,
    A.map(([topic, value]) => ({ [topic]: value })),
    O.fromNullable,
    O.map((data) => data.sort((a, b) => Object.values(b)[0] - Object.values(a)[0])),
    O.map(A.takeLeft(5)),
    O.map((data) => data.sort((a, b) => Object.keys(a)[0].localeCompare(Object.keys(b)[0]))),
    O.fold(
      () => [],
      (data) => data
    )
  )

  const options = {
    responsive: true,
    legend: {
      display: false
    },
    scales: {
      y: {
        min: 0,
        ticks: {
          stepSize: 1
        }
      }
    },
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
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
      titleFontColor: theme.palette.text.primary
    }
  }

  const data = {
    labels: mappedOccurrences.map((obj) => Object.keys(obj)[0]),
    datasets: [
      {
        data: mappedOccurrences.map((obj) => Object.values(obj)[0]),
        backgroundColor: ["#14b8a6", "#7c4dff", "#3F51B5", "#e53935", "#FF9800"],
        maxBarThickness: 50
      }
    ]
  }
  return (
    <Card sx={{ height: "100%" }}>
      <CardHeader
        title={
          <CardHeaderTitle
            title="Top 5 Most Used Technologies"
            toolTipText="This graph shows your most used technologies from your courses and projects. Each number represent how many courses and projects use that technology"
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
          <Bar options={options} data={data} />
        </Box>
      </CardContent>
    </Card>
  )
}

export default TopicsChart
