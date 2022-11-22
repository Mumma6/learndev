import Head from "next/head"
import Link from "next/link"

// TODO. lägg till en routeguard

export default function Home(): React.ReactElement {
  return (
    <>
      <Head>
        <title>Dev learner</title>
      </Head>
      <h1>Helllooo</h1>
      <Link href="/sign-up" passHref>
        Registrera konto
      </Link>
    </>
  )
}
