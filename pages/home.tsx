import Head from "next/head"
import React from "react"
import Home from "../components/overview/Home"
import { DashboardLayout } from "../components/dashboard/DashboardLayout"
import { useCurrentUser } from "../lib/hooks"

const home = () => {
  // Används för att få userdata i protected routes.
  const { data } = useCurrentUser()

  return (
    <>
      <DashboardLayout>
        <Head>
          <title>{`Dashboard | ${data?.payload?.name}`}</title>
        </Head>
        <Home user={data?.payload!} />
      </DashboardLayout>
    </>
  )
}

export default home