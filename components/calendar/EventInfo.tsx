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

interface IProps {
  event: IEventInfo
}

const EventInfo = ({ event }: IProps) => {
  return (
    <>
      <Typography variant="body2">{event.title}</Typography>
      <Typography variant="body2">{event.description}</Typography>
    </>
  )
}

export default EventInfo
