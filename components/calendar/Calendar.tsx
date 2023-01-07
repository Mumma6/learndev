import React from "react"

import { Box, Container, Typography, Pagination, Card, CardContent, CardHeader, Divider } from "@mui/material"

import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import { EventApi, DateSelectArg, EventClickArg, EventContentArg, formatDate } from "@fullcalendar/core"

/*

skapa vettiga modals för att göra nya samt editera / kolla / deleta
Ska kunna välja backgrunds färg (ha 5 olika alternativ redo)

Bestäm vilka fält som ska kunna fyllas i

*/

const Calendar = () => {
  const [currentEvents, setCurrentEvents] = React.useState<EventApi[]>()
  const handleEventClick = (clickInfo: EventClickArg) => {
    console.log(clickInfo)
    if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
      clickInfo.event.remove()
    }
  }

  function renderEventContent(eventContent: EventContentArg) {
    console.log(eventContent.event.extendedProps)
    return (
      <>
        <Typography color="white" variant="caption">
          {eventContent.timeText}
        </Typography>
        <Typography color="white" variant="subtitle2">
          {eventContent.event.title}
        </Typography>
      </>
    )
  }

  const handleEvents = (events: EventApi[]) => {
    setCurrentEvents(events)
  }

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    console.log(selectInfo)

    if (!selectInfo) {
      return null
    }
    let title = prompt("Please enter a new title for your event")
    let calendarApi = selectInfo.view.calendar

    calendarApi.unselect() // clear date selection

    if (title && selectInfo) {
      calendarApi.addEvent({
        id: Math.floor(Math.random() * 1000).toString(),
        title,
        url: "en url",
        backgroundColor: "red",
        start: selectInfo?.startStr,
        end: selectInfo?.endStr,
        allDay: selectInfo?.allDay,
        hej: "hej",
      })
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
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay",
              }}
              initialView="timeGridWeek"
              editable={true}
              selectable={true}
              selectMirror={true}
              dayMaxEvents={true}
              weekends={true}
              //initialEvents={INITIAL_EVENTS} // alternatively, use the `events` setting to fetch from a feed
              select={handleDateSelect}
              eventContent={renderEventContent} // custom render function
              eventClick={handleEventClick}
              eventsSet={handleEvents} // called after events are initialized/added/changed/removed
              /* you can update a remote database when these fire:
            eventAdd={function(){}}
            eventChange={function(){}}
            eventRemove={function(){}}
            */
            />
          </CardContent>
        </Card>
      </Container>
    </Box>
  )
}

export default Calendar
