import type { AppInitialProps } from "next/app"
import type { Router } from "next/router"
import type { NextComponentType } from "next/types"
import { ToastContainer } from "react-toastify"
import "bootstrap/dist/css/bootstrap.min.css"
import "react-toastify/dist/ReactToastify.css"

interface AppProps extends AppInitialProps {
  Component: NextComponentType
  router: Router
}

export default function PopularMusicVenue({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <ToastContainer />
    </>
  )
}
