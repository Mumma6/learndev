import Head from "next/head"
import React from "react"
import { DashboardLayout } from "../../components/dashboard/DashboardLayout"
import { Projects } from "../../components/projects/Projects"

const project = () => {
  return (
    <>
      <DashboardLayout>
        <Head>
          <title>Projects</title>
        </Head>
        <Projects />
      </DashboardLayout>
    </>
  )
}

export default project
