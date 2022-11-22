import type { AppInitialProps } from "next/app"
import type { Router } from "next/router"
import type { NextComponentType } from "next/types"
import { ToastContainer } from "react-toastify"
import "bootstrap/dist/css/bootstrap.min.css"
import "react-toastify/dist/ReactToastify.css"
import Header from "../components/layout/Header"
import Container from "react-bootstrap/Container"

interface AppProps extends AppInitialProps {
  Component: NextComponentType
  router: Router
}

// Context och andra providers används här.
// TODO. lägg till en routeguard

export default function PopularMusicVenue({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <>
      <Header />
      <Container>
        <Component {...pageProps} />
      </Container>

      <ToastContainer position="bottom-right" autoClose={2000} />
    </>
  )
}
