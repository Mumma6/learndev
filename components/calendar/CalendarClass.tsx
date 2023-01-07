import React from "react"
import { EventApi, DateSelectArg, EventClickArg, EventContentArg, formatDate } from "@fullcalendar/core"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"

import { Box, Container, Grid, Typography, Card, CardContent, CardHeader, Divider } from "@mui/material"

interface CalendarClassState {
  currentEvents: EventApi[]
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

export default class CalendarClass extends React.Component<{}, CalendarClassState> {
  state: CalendarClassState = {
    currentEvents: [],
  }

  handleDateSelect = (selectInfo: DateSelectArg) => {
    console.log(selectInfo)
    let title = prompt("Please enter a new title for your event")
    let calendarApi = selectInfo.view.calendar

    calendarApi.unselect() // clear date selection

    if (title) {
      calendarApi.addEvent({
        id: Math.floor(Math.random() * 1000).toString(),
        title,
        url: "en url",
        backgroundColor: "red",
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay,
        hej: "hej",
      })
    }
  }

  handleEventClick = (clickInfo: EventClickArg) => {
    console.log(clickInfo)
    if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
      clickInfo.event.remove()
    }
  }

  handleEvents = (events: EventApi[]) => {
    this.setState({
      currentEvents: events,
    })
  }

  render(): React.ReactNode {
    return (
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
        select={this.handleDateSelect}
        eventContent={renderEventContent} // custom render function
        eventClick={this.handleEventClick}
        eventsSet={this.handleEvents} // called after events are initialized/added/changed/removed
        /* you can update a remote database when these fire:
            eventAdd={function(){}}
            eventChange={function(){}}
            eventRemove={function(){}}
            */
      />
    )
  }
}
