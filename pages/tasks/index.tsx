import Head from "next/head"
import React from "react"
import { DashboardLayout } from "../../components/dashboard/DashboardLayout"

import Tasks from "../../components/tasks/Tasks"

const tasks = () => {
  return (
    <>
      <DashboardLayout>
        <Head>
          <title>Tasks</title>
        </Head>
        <Tasks />
      </DashboardLayout>
    </>
  )
}

export default tasks
