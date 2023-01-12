import React from "react"
import { Event } from "react-big-calendar"
import { IEventInfo } from "../../models/EventInfo"

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
import { useEvents } from "../../lib/hooks"

interface IProps {
  event: IEventInfo
}

const EventInfo = ({ event }: IProps) => {
  const { data } = useEvents()
  console.log(event)
  return (
    <>
      <Typography variant="body2">{event.title}</Typography>
      <Typography variant="body2">{event.description}</Typography>
    </>
  )
}

export default EventInfo
