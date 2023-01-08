import React, { useState, useCallback } from "react"

import { Box, Container, Typography, Pagination, Card, CardContent, CardHeader, Divider } from "@mui/material"

import { Calendar, dateFnsLocalizer } from "react-big-calendar"

import format from "date-fns/format"
import parse from "date-fns/parse"
import startOfWeek from "date-fns/startOfWeek"
import getDay from "date-fns/getDay"
import enUS from "date-fns/locale/en-US"
import addHours from "date-fns/addHours"
import startOfHour from "date-fns/startOfHour"

import "react-big-calendar/lib/css/react-big-calendar.css"

const locales = {
  "en-US": enUS,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

const StudyCalendar = () => {
  const [myEvents, setEvents] = useState([])

  const handleSelectSlot = useCallback(
    ({ start, end }: any) => {
      const title = window.prompt("New Event name")
      if (title) {
        // @ts-ignore
        setEvents((prev) => [...prev, { start, end, title }])
      }
    },
    [setEvents]
  )

  const handleSelectEvent = useCallback((event: any) => window.alert(event.title), [])

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8,
      }}
    >
      <Container maxWidth={false}>
        <Card>
          <CardHeader title="Calendar" subheader="Use for planning" />
          <Divider />
          <CardContent>
            <Calendar
              localizer={localizer}
              events={myEvents}
              onSelectEvent={handleSelectEvent}
              onSelectSlot={handleSelectSlot}
              selectable
              startAccessor="start"
              endAccessor="end"
              style={{ height: 500 }}
            />
          </CardContent>
        </Card>
      </Container>
    </Box>
  )
}

export default StudyCalendar
