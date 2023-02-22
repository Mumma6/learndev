import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect } from "react"
import Landing from "../components/landing/Landing"
import { useCurrentUser } from "../lib/hooks"

// TODO. lägg till en routeguard

export default function Home(): React.ReactElement {
  return (
    <>
      <Head>
        <title>Studify</title>
      </Head>
      <Landing />
    </>
  )
}
