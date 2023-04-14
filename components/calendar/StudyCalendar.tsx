import React, { useState, useCallback, useEffect } from "react"
import * as _ from "lodash"

import {
  Box,
  Container,
  Typography,
  Pagination,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Button,
  ButtonGroup,
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

import EventInfo from "./EventInfo"
import { IEventInfo } from "../../models/EventInfo"
import { IQuiz } from "../../models/Quiz"
import AddEventInfoModal from "./AddEventInfoModal"
import { ClickEvent } from "../../types/generics"
import { useCourses, useCurrentUser, useEvents } from "../../lib/hooks"
import { fetcher } from "../../lib/axiosFetcher"
import { toast } from "react-toastify"
import { useSWRConfig } from "swr"
import EditEventInfoModal from "./EditEventInfoModal"
import AddEventModal from "./AddEventModal"
import AddLabelModal from "./AddLabelModal"
import { UserSettingsLabelType } from "../../schema/UserSchema"

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
  activityName: string | undefined
  activityId: string | undefined
  activityGroup: string | undefined
  labelName: string | undefined
  labelColor: string | undefined
}

export const initialEventFormState: EventFormData = {
  title: "",
  description: "",
  activityName: undefined,
  activityId: undefined,
  labelName: undefined,
  labelColor: undefined,
  activityGroup: undefined,
}

export interface ExternEventFormData {
  title: string
  description: string
  start: Date | undefined
  end: Date | undefined
  allDay: boolean
  activityName: string | undefined
  activityId: string | undefined
  activityGroup: string | undefined
  labelName: string | undefined
  labelColor: string | undefined
}

export const initialExternEventFormState: ExternEventFormData = {
  title: "",
  description: "",
  start: undefined,
  end: undefined,
  allDay: false,
  activityName: undefined,
  activityId: undefined,
  labelName: undefined,
  labelColor: undefined,
  activityGroup: undefined,
}

const StudyCalendar = () => {
  const [myEvents, setEvents] = useState<Omit<IEventInfo, "userId">[]>([])
  const [currentEvent, setCurrentEvent] = useState<Event | IEventInfo | null>(null)
  const [open, setOpen] = useState(false)
  const [openExternModal, setOpenExternModal] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [openLabelModal, setOpenLabelModal] = useState(false)
  const [eventFormData, setEventFormData] = useState<EventFormData>(initialEventFormState)

  const [labels, setLabels] = useState<UserSettingsLabelType[]>([])

  const [externEventFormData, setExternEventFormData] = useState<ExternEventFormData>(initialExternEventFormState)

  const { data: eventsData } = useEvents()
  const { data: userData } = useCurrentUser()

  useEffect(() => {
    setLabels([...(userData?.payload?.userSettings.labels || [])])
  }, [userData?.payload])

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

  // kanske kan ha type EventInfo
  const handleSelectEvent = (event: IEventInfo) => {
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
        const response = await fetcher(`/api/events?_id=${_id}`, {
          method: "DELETE",
        })

        if (response?.error) {
          toast.error(response.error)
        } else {
          mutate("/api/events")
          toast.success(response?.message)
        }
      } catch (error) {}
    }

    handleEditModalClose()
  }

  const handleClose = () => {
    setOpen(false)
  }

  const onAddExternEvent = async (e: ClickEvent) => {
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
      const response = await fetcher<undefined, Omit<IEventInfo, "userId">>("/api/events", {
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
      const response = await fetcher<undefined, Omit<IEventInfo, "userId">>("/api/events", {
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
  /*
 <Box mt={2}>
              <Button onClick={() => setOpenLabelModal(true)} size="small" variant="contained">
                Create study plan, "go to new page"
              </Button>
            </Box>
  */

  return (
    <Box
      mt={2}
      mb={2}
      component="main"
      sx={{
        flexGrow: 1,
        py: 8,
      }}
    >
      <AddLabelModal open={openLabelModal} handleClose={() => setOpenLabelModal(false)} />
      <Container maxWidth={false}>
        <Card>
          <CardHeader
            title="Calendar"
            subheader="Use the calender to plan your study. Create different labels to stay organized and link to different activities. Use the button to Add event or drag your mouse in the calendar"
          />
          <Divider />
          <CardContent>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <ButtonGroup size="large" variant="contained" aria-label="outlined primary button group">
                <Button onClick={() => setOpenExternModal(true)} size="small" variant="contained">
                  Add event
                </Button>
                <Button onClick={() => setOpenLabelModal(true)} size="small" variant="contained">
                  Create label
                </Button>
              </ButtonGroup>
            </Box>
            <Box></Box>

            <Divider style={{ margin: 10 }} />
            <AddEventModal
              open={openExternModal}
              handleClose={() => setOpenExternModal(false)}
              externEventFormData={externEventFormData}
              setExternEventFormData={setExternEventFormData}
              onAddExternEvent={onAddExternEvent}
              labels={labels}
            />
            <EditEventInfoModal
              open={editModalOpen}
              handleClose={handleEditModalClose}
              onDeleteEvent={onDeleteEvent}
              currentEvent={currentEvent as IEventInfo}
            />
            <AddEventInfoModal
              open={open}
              handleClose={handleClose}
              eventFormData={eventFormData}
              setEventFormData={setEventFormData}
              onAddEvent={onAddEvent}
              currentEvent={currentEvent}
              labels={labels}
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
              eventPropGetter={(event) => {
                return {
                  style: {
                    backgroundColor: event.labelColor || "#b64fc8",
                    borderColor: event.labelColor || "#b64fc8",
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

/*

------------------
Schema validation needs to be done sometime
-------------------

Add min={date} and max={date} to calender to control the time view.


*/
