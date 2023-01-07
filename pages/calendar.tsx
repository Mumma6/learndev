import React from "react"
import { DashboardLayout } from "../components/dashboard/DashboardLayout"
import Head from "next/head"
import Calendar from "../components/calendar/Calendar"

const calendar = () => {
  return (
    <>
      <DashboardLayout>
        <Head>
          <title>Calendar</title>
        </Head>
        <Calendar />
      </DashboardLayout>
    </>
  )
}

export default calendar
