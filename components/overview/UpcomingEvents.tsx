import React from "react"
import { Box, Card, CardContent, CardHeader, Divider, Typography, Avatar } from "@mui/material"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import Paper from "@mui/material/Paper"
import { useEvents } from "../../lib/hooks"
import { format } from "date-fns"
import { IEventInfo } from "../../models/EventInfo"
import _ from "lodash"

const UpcomingEvents = () => {
  const { data } = useEvents()

  const formateDate = (date: Date) => format(new Date(date), "MM-dd HH:mm")

  const createRow = (event: IEventInfo) => (
    <TableRow sx={{ borderRadius: 40, backgroundColor: event.labelColor || null }}>
      <TableCell component="th" scope="row">
        <Box sx={{ display: "flex" }}>
          <Typography>{event.title}</Typography>
        </Box>
      </TableCell>
      <TableCell>
        <Box sx={{ display: "flex" }}>
          <Typography>{`${formateDate(event.start!)} - ${formateDate(event.end!)}`}</Typography>
        </Box>
      </TableCell>
    </TableRow>
  )

  return (
    <Card sx={{ height: "100%" }}>
      <CardHeader title="Upcoming events" />
      <Divider />
      <CardContent>
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Time</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {_.sortBy(data?.payload, ["start", "title"])
                .slice(0, 6)
                .map((event) => createRow(event))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  )
}

export default UpcomingEvents
