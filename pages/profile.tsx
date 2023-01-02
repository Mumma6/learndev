import React from "react"
import { DashboardLayout } from "../components/dashboard/DashboardLayout"
import Profile from "../components/profile/Profile"

const profile = () => {
  return (
    <>
      <DashboardLayout>
        <Profile />
      </DashboardLayout>
    </>
  )
}

export default profile
