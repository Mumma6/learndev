import Head from "next/head"
import Landing from "../components/landing/Landing"

// TODO. lägg till en routeguard

export default function Home (): React.ReactElement {
  return (
    <>
      <Head>
        <title>Studify</title>
      </Head>
      <Landing />
    </>
  )
}
