import React from "react"
import { DashboardLayout } from "../components/dashboard/DashboardLayout"
import { Projects } from "../components/projects/Projects"

const project = () => {
  return (
    <>
      <DashboardLayout>
        <Projects />
      </DashboardLayout>
    </>
  )
}

export default project
