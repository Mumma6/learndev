import React from "react"
import { Event } from "react-big-calendar"
import { IEventInfo } from "../../models/EventInfo"

import { Box, Container, Typography, Pagination, Card, CardContent, CardHeader, Divider, Button } from "@mui/material"
import { useRouter } from "next/router"

interface IProps {
  event: IEventInfo
}

const EventInfo = ({ event }: IProps) => {
  return (
    <>
      <Typography variant="body2">{event.title}</Typography>
      {event.activityName && (
        <Typography style={{ fontSize: 11 }} variant="body2">
          {event.activityName}
        </Typography>
      )}
    </>
  )
}

export default EventInfo
