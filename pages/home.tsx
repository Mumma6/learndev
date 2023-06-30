import Head from "next/head"
import React from "react"
import Home from "../components/overview/Home"
import { DashboardLayout } from "../components/dashboard/DashboardLayout"
import { useCurrentUser } from "../lib/hooks"
import { pipe } from "fp-ts/lib/function"
import * as O from "fp-ts/Option"

const home = () => {
  // Används för att få userdata i protected routes.
  const { data } = useCurrentUser()

  return pipe(
    data?.payload,
    O.fromNullable,
    O.fold(
      () => (
        <>
          <DashboardLayout>
            <p>Loading...</p>
          </DashboardLayout>
        </>
      ),
      (response) => (
        <>
          <DashboardLayout>
            <Head>
              <title>{`Dashboard | ${response.name}`}</title>
            </Head>
            <Home user={response} />
          </DashboardLayout>
        </>
      )
    )
  )
}

export default home
