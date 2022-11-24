import React from "react"
import Head from "next/head"
import Settings from "../components/Settings/Settings"
import { DashboardLayout } from "../components/dashboard/DashboardLayout"

const SettingPage = () => {
  console.log("settingPage")

  return (
    <>
      <DashboardLayout>
        <Head>
          <title>{`Settings |`}</title>
        </Head>
        <Settings />
      </DashboardLayout>
    </>
  )
}

export default SettingPage
