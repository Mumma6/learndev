import React from "react"

import { Box, Container, Grid, Pagination, Card, CardContent, CardHeader, Divider } from "@mui/material"
import CalendarClass from "./CalendarClass"

/*

skapa vettiga modals för att göra nya samt editera / kolla / deleta
Ska kunna välja backgrunds färg (ha 5 olika alternativ redo)

Bestäm vilka fält som ska kunna fyllas i

*/

const Calendar = () => {
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
            <CalendarClass />
          </CardContent>
        </Card>
      </Container>
    </Box>
  )
}

export default Calendar
