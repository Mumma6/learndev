import React from "react"
import { DashboardLayout } from "../components/dashboard/DashboardLayout"
import Head from "next/head"
import StudyCalendar from "../components/calendar/StudyCalendar"

const calendar = () => {
  return (
    <>
      <DashboardLayout>
        <Head>
          <title>Calendar</title>
        </Head>
        <StudyCalendar />
      </DashboardLayout>
    </>
  )
}

export default calendar
