import React, { useState, useCallback, useEffect } from "react"
import * as _ from "lodash"

import { Box, Container, Typography, Pagination, Card, CardContent, CardHeader, Divider, Button } from "@mui/material"

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
import EditEventInfoModal from "./EditEventInfoModal"
import AddEventModal from "./AddEventModal"

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
  color: null | string
}

export const initialEventFormState: EventFormData = {
  title: "",
  description: "",
  quiz: null,
  course: null,
  color: null,
}

export interface ExternEventFormData {
  title: string
  description: string
  start: Date | undefined
  end: Date | undefined
  allDay: boolean
  quiz: IQuiz | null
  course: ICourse | null
  color: null | string
}

export const initialExternEventFormState: ExternEventFormData = {
  title: "",
  description: "",
  start: undefined,
  end: undefined,
  allDay: false,
  quiz: null,
  course: null,
  color: null,
}

const StudyCalendar = () => {
  const [myEvents, setEvents] = useState<Omit<IEventInfo, "userId">[]>([])
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null)
  const [open, setOpen] = useState(false)
  const [openExternModal, setOpenExternModal] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [eventFormData, setEventFormData] = useState<EventFormData>(initialEventFormState)

  const [externEventFormData, setExternEventFormData] = useState<ExternEventFormData>(initialExternEventFormState)

  const { data: eventsData } = useEvents()

  useEffect(() => {
    console.log("effect")
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
    console.log(event)
    setOpen(true)
    setCurrentEvent(event)
  }

  // kanske kan ha type EventInfo
  const handleSelectEvent = (event: Event) => {
    setCurrentEvent(event)
    setEditModalOpen(true)
  }

  const handleEditModalClose = () => {
    setEditModalOpen(false)
  }

  const onDeleteEvent = async (e: ClickEvent) => {
    e.preventDefault()

    const e1 = {
      title: currentEvent?.title,
      start: currentEvent?.start,
      end: currentEvent?.end,
    }

    // This is only because currentEvent dont have a id field....
    const findFn = (event: IEventInfo) => {
      const matchEvent = {
        title: event.title,
        start: new Date(event.start!),
        end: new Date(event.end!),
      }

      return _.isEqual(e1, matchEvent)
    }

    const match = eventsData?.payload?.find(findFn)

    if (match) {
      try {
        const { _id } = match
        const response = await fetcher1(`/api/events?_id=${_id}`, {
          method: "DELETE",
        })

        if (response?.error) {
          toast.error(response.error)
        } else {
          mutate("/api/events")
          toast.success(response?.message)
        }
      } catch (error) {
        console.log(error)
      }
    }

    handleEditModalClose()
  }

  const handleClose = () => {
    setOpen(false)
  }

  const onAddExternEvent = async (e: ClickEvent) => {
    console.log(externEventFormData)

    console.log("lägg till via extern")

    e.preventDefault()

    function addHours(date: any, hours: number) {
      date.setHours(date.getHours() + hours)

      return date
    }

    const setMinToZero = (date: any) => {
      date.setSeconds(0)

      return date
    }

    try {
      const response = await fetcher1<undefined, Omit<IEventInfo, "userId">>("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: {
          ...externEventFormData,
          start: setMinToZero(externEventFormData.start),
          end: externEventFormData.allDay ? addHours(externEventFormData.start, 12) : setMinToZero(externEventFormData.end),
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
      setExternEventFormData(initialExternEventFormState)
    }
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
            <Button onClick={() => setOpenExternModal(true)} size="large" variant="contained">
              Add event
            </Button>
            <AddEventModal
              open={openExternModal}
              handleClose={() => setOpenExternModal(false)}
              externEventFormData={externEventFormData}
              setExternEventFormData={setExternEventFormData}
              onAddExternEvent={onAddExternEvent}
            />
            <EditEventInfoModal open={editModalOpen} handleClose={handleEditModalClose} onDeleteEvent={onDeleteEvent} />
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
            <p>ska kunna lägga till en färg/label. Visa en Select i modalerna</p>
            <p>Kunna länka till quiz/course/project</p>

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
              eventPropGetter={(event) => {
                return {
                  style: {
                    backgroundColor: event.color || "#b64fc8",
                    borderColor: event.color || "#b64fc8",
                  },
                }
              }}
              style={{
                height: 900,
              }}
            />
          </CardContent>
        </Card>
      </Container>
    </Box>
  )
}

export default StudyCalendar
