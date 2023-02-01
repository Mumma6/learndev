import Head from "next/head"
import React from "react"
import { DashboardLayout } from "../../components/dashboard/DashboardLayout"
import Resources from "../../components/resources/Resources"

const resources = () => {
  return (
    <>
      <DashboardLayout>
        <Head>
          <title>Resources</title>
        </Head>
        <Resources />
      </DashboardLayout>
    </>
  )
}

export default resources
