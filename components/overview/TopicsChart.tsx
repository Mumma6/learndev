import React from "react"
import { Box, Card, CardContent, CardHeader, Divider, Typography, useTheme } from "@mui/material"
import { Bar } from "react-chartjs-2"
import { useCourses, useProjects } from "../../lib/hooks"
import { SkillSchemaType } from "../.../../../schema/SharedSchema"
import CardHeaderTitle from "../shared/CardHeaderTitle"
import * as E from "fp-ts/Either"
import { pipe } from "fp-ts/function"
import * as A from "fp-ts/Array"
import * as S from "fp-ts/string"

const TopicsChart = () => {
  const theme = useTheme()
  const { data: courseData } = useCourses()
  const { data: projectData } = useProjects()

  type Total = {
    [key: string]: number
  }

  const topicsOccurrences = [
    courseData?.payload?.map((course) => course.topics.map((topic) => topic.label)).flat(),
    projectData?.payload?.map((project) => project.techStack.map((project) => project.label)).flat(),
  ]
    .flat()
    .filter(Boolean) as string[]

  const getNumberOfOccurrences = (list: string[]) => {
    return list.reduce((total: Total, skill: string) => {
      total[skill] = total[skill] ? total[skill] + 1 : 1
      return total
    }, {})
  }

  const mappedOccurrences = Object.entries(getNumberOfOccurrences(topicsOccurrences))
    .map(([topic, value]) => ({
      [topic]: value,
    }))
    .sort((a, b) => {
      const valueA = Object.values(a)[0]
      const valueB = Object.values(b)[0]
      return valueB - valueA
    })
    .slice(0, 5)
    .sort((a, b) => {
      const keyA = Object.keys(a)[0]
      const keyB = Object.keys(b)[0]
      if (keyA < keyB) return -1
      if (keyA > keyB) return 1
      return 0
    })

  const options = {
    responsive: true,
    legend: {
      display: false,
    },
    scales: {
      y: {
        min: 0,
        ticks: {
          stepSize: 1,
        },
      },
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

  const data = {
    labels: mappedOccurrences.map((obj) => Object.keys(obj)[0]),
    datasets: [
      {
        data: mappedOccurrences.map((obj) => Object.values(obj)[0]),
        backgroundColor: ["#14b8a6", "#7c4dff", "#3F51B5", "#e53935", "#FF9800"],
        maxBarThickness: 50,
      },
    ],
  }
  return (
    <Card sx={{ height: "100%" }}>
      <CardHeader
        title={
          <CardHeaderTitle
            title="Tech coverage"
            toolTipText="This graph shows your most used technologies from your courses and projects. Each number represent how many courses and projects use that technology"
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
          <Bar options={options} data={data} />
        </Box>
      </CardContent>
    </Card>
  )
}

export default TopicsChart

/*
import * as E from "fp-ts/Either"
import { pipe } from "fp-ts/function"
import * as A from "fp-ts/Array"
import * as S from "fp-ts/string"

const { data: courseData } = useCourses()
const { data: projectData } = useProjects()

type Total = Record<string, number>

const topicsOccurrences = pipe(
  [
    ...courseData?.payload?.flatMap((course) => course.topics.map((topic) => topic.label)),
    ...projectData?.payload?.flatMap((project) => project.techStack.map((project) => project.label)),
  ],
  A.filter(S.trim), // remove empty strings
  A.sort(S.Ord), // sort alphabetically
)

const getNumberOfOccurrences = (list: string[]) =>
  pipe(
    list,
    A.reduce<Total>({}, (total, skill) => {
      total[skill] = total[skill] ? total[skill] + 1 : 1
      return total
    }),
  )

const mappedOccurrences = pipe(
  topicsOccurrences,
  getNumberOfOccurrences,
  Object.entries,
  A.sort((a, b) => b[1] - a[1]), // sort by frequency
  A.takeLeft(5),
  A.sort((a, b) => S.Ord.compare(Object.keys(a)[0], Object.keys(b)[0])), // sort alphabetically by topic name
  A.map(([topic, value]) => ({
    [topic]: value,
  })),
)
*/
