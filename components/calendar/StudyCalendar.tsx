import React, { useState, useCallback } from "react"

import { Box, Container, Typography, Pagination, Card, CardContent, CardHeader, Divider } from "@mui/material"

import { Calendar, dateFnsLocalizer, Event, Views } from "react-big-calendar"

import format from "date-fns/format"
import parse from "date-fns/parse"
import startOfWeek from "date-fns/startOfWeek"
import getDay from "date-fns/getDay"
import enUS from "date-fns/locale/en-US"
import addHours from "date-fns/addHours"
import startOfHour from "date-fns/startOfHour"

import "react-big-calendar/lib/css/react-big-calendar.css"
import { ICourse } from "../../models/Course"
import EventInfo from "./EventInfo"
import { IEventInfo } from "../../models/EventInfo"
import { IQuiz } from "../../models/Quiz"
import AddEventInfoModal from "./AddEventInfoModal"
import { ClickEvent } from "../../types/generics"

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

export interface EventFormData {
  title: string
  description: string
  quiz: IQuiz | null
  course: ICourse | null
}

export const initialEventFormState: EventFormData = {
  title: "",
  description: "",
  quiz: null,
  course: null,
}

const StudyCalendar = () => {
  const [myEvents, setEvents] = useState<IEventInfo[]>([])
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null)
  const [open, setOpen] = useState(false)
  const [eventFormData, setEventFormData] = useState<EventFormData>(initialEventFormState)

  const handleSelectSlot1 = useCallback(
    (event: Event) => {
      console.log(event)

      // Ersätt detta med en vettig modal.
      const title = window.prompt("New Event name")
      if (title) {
        setEvents((prev) => [...prev, { start: event.start, end: event.end, title, description: "hej", kurs: "1" }])
      }
    },
    [setEvents]
  )

  const handleSelectSlot = (event: Event) => {
    setOpen(true)
    setCurrentEvent(event)
  }

  // detta ska rendera en EventDescription komponent.
  // Där man kan ändra/ta bort
  const handleSelectEvent = useCallback((event: any) => window.alert(event.title), [])

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const onAddEvent = (e: ClickEvent) => {
    e.preventDefault()
    console.log("nytt event")

    setEventFormData(initialEventFormState)

    setEvents((prev) => [
      ...prev,
      {
        start: currentEvent?.start,
        end: currentEvent?.end,
        title: eventFormData.title,
        description: eventFormData.description,
      },
    ])

    setOpen(false)
  }

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
            <AddEventInfoModal
              open={open}
              handleClose={handleClose}
              eventFormData={eventFormData}
              setEventFormData={setEventFormData}
              onAddEvent={onAddEvent}
              currentEvent={currentEvent}
            />
            <p>
              Knapp för att lägga till ett mål (course som ska vara klar, quiz som ska tas, skill som ska läras, project som
              ska vara klart.) osv osv
            </p>
            <p>Målen ska sträcka sig över hela dagen. Så "allDay" true.</p>
            <p>Detta blir inte currentEvent som kommer från kalendenr. Lägg till en mui date picker. i En ny modal.</p>
            <Calendar
              localizer={localizer}
              events={myEvents}
              onSelectEvent={handleSelectEvent}
              onSelectSlot={handleSelectSlot}
              selectable
              startAccessor="start"
              components={{ event: EventInfo }}
              endAccessor="end"
              defaultView="week"
              style={{
                height: 700,
              }}
            />
          </CardContent>
        </Card>
      </Container>
    </Box>
  )
}

export default StudyCalendar
