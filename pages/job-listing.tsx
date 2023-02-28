import Head from "next/head"
import React from "react"
import { DashboardLayout } from "../components/dashboard/DashboardLayout"
import JobListnings from "../components/jobs/JobListnings"

const jobListing = () => {
  return (
    <>
      <DashboardLayout>
        <Head>
          <title>Jobs</title>
        </Head>
        <JobListnings />
      </DashboardLayout>
    </>
  )
}

export default jobListing
