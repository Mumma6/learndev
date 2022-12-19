import Head from "next/head"
import React from "react"
import Dashboard from "../components/dashboard/Dashboard"
import { DashboardLayout } from "../components/dashboard/DashboardLayout"
import { useCurrentUser } from "../lib/hooks"

const dashboard = () => {
  // Används för att få userdata i protected routes.
  const { data } = useCurrentUser()

  return (
    <>
      <DashboardLayout>
        <Head>
          <title>{`Dashboard | ${data?.payload?.name}`}</title>
        </Head>
        <Dashboard user={data?.payload!} />
      </DashboardLayout>
    </>
  )
}

export default dashboard
