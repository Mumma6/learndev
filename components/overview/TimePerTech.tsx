import React from "react"
import { Box, Card, CardContent, CardHeader, Divider, useTheme } from "@mui/material"
import { Bar } from "react-chartjs-2"
import { pipe } from "fp-ts/function"
import * as A from "fp-ts/Array"
import * as O from "fp-ts/Option"
import * as R from "fp-ts/Record"

import CardHeaderTitle from "../shared/CardHeaderTitle"
import { CourseModelSchemaType } from "../../schema/CourseSchema"
import { typeColors } from "../../helpers/helpers"

interface IProps {
  courses: CourseModelSchemaType[] | null | undefined
}

type TechDuration = Record<string, number>

const TimePerTech = ({ courses }: IProps) => {
  const theme = useTheme()

  const addDuration = (acc: TechDuration, [tech, duration]: [string, number]): TechDuration => ({
    ...acc,
    [tech]: (acc[tech] ?? 0) + duration,
  })

  const mergeTechDurations = (techDurations: TechDuration[]): TechDuration =>
    techDurations.reduce((acc, curr) => Object.entries(curr).reduce(addDuration, acc), {})

  const mapTechAndDuration = (cs: CourseModelSchemaType[]) =>
    pipe(
      cs,
      A.filter((c) => c.content.status === "Done"),
      A.map((c) =>
        pipe(
          c.topics,
          A.map((tech) => ({ [tech.label]: c.content.duration }))
        )
      ),
      A.flatten,
      mergeTechDurations
    )

  const convertObjectToArray = (as: TechDuration) =>
    Object.entries(as)
      .map(([label, duration]) => ({ label, duration }))
      .sort((a, b) => a.label.localeCompare(b.label))

  const durationForEachTech = pipe(
    courses,
    O.fromNullable,
    O.map(mapTechAndDuration),
    O.map(convertObjectToArray),
    O.getOrElseW(() => [])
  )

  const options = {
    responsive: true,
    legend: {
      display: false,
    },
    scales: {
      y: {
        min: 0,
        ticks: {
          stepSize: 10,
          callback: function (value: unknown) {
            return value + "h"
          },
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
    labels: durationForEachTech.map(({ label }) => label),
    datasets: [
      {
        data: durationForEachTech.map(({ duration }) => duration),
        backgroundColor: typeColors,
        maxBarThickness: 50,
      },
    ],
  }

  return (
    <Card sx={{ height: "100%" }}>
      <CardHeader
        title={
          <CardHeaderTitle
            title="Technology Duration Distribution"
            toolTipText="This graph shows how much time you have spent on each technology in your courses. This will only factor in courses that are completed."
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

export default TimePerTech
