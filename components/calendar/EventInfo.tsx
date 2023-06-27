import React from "react"
import { type IEventInfo } from "../../models/EventInfo"

import { Typography } from "@mui/material"

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
