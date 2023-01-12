import React, { useState, useCallback, useEffect } from "react"

import {
  Box,
  Container,
  Typography,
  Pagination,
  Card,
  CardContent,
  CardHeader,
  Divider,
} from "@mui/material"

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
import { useCurrentUser, useEvents } from "../../lib/hooks"
import { fetcher1 } from "../../lib/axiosFetcher"
import { toast } from "react-toastify"
import { useSWRConfig } from "swr"

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
  const [myEvents, setEvents] = useState<Omit<IEventInfo, "userId">[]>([])
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null)
  const [open, setOpen] = useState(false)
  const [eventFormData, setEventFormData] = useState<EventFormData>(initialEventFormState)

  const { data: eventsData } = useEvents()

  useEffect(() => {
    setEvents([
      ...(eventsData?.payload || []).map((e) => ({
        ...e,
        start: new Date(e.start!),
        end: new Date(e.end!),
      })),
    ])
  }, [eventsData?.payload])

  const { mutate } = useSWRConfig()

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

  const onAddEvent = async (e: ClickEvent) => {
    e.preventDefault()

    try {
      const response = await fetcher1<undefined, Omit<IEventInfo, "userId">>("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: {
          ...eventFormData,
          start: currentEvent?.start,
          end: currentEvent?.end,
        },
      })

      if (response?.error) {
        toast.error(response.error)
      } else {
        mutate("/api/events")
        toast.success(response?.message)
      }
    } catch (e: any) {
      console.log(e)
    } finally {
      setEventFormData(initialEventFormState)

      handleClose()
    }
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
            <p>Add event (egen modal)</p>
            <AddEventInfoModal
              open={open}
              handleClose={handleClose}
              eventFormData={eventFormData}
              setEventFormData={setEventFormData}
              onAddEvent={onAddEvent}
              currentEvent={currentEvent}
            />
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
