import React from "react"
import Settings from "../components/Settings/Settings"
import { DashboardLayout } from "../components/dashboard/DashboardLayout"

const SettingPage = () => {
  return (
    <>
      <DashboardLayout>
        <Settings />
      </DashboardLayout>
    </>
  )
}

export default SettingPage
