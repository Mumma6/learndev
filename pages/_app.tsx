import type { AppInitialProps } from "next/app"
import type { Router } from "next/router"
import type { NextComponentType } from "next/types"
import { ToastContainer } from "react-toastify"
import "bootstrap/dist/css/bootstrap.min.css"
import "react-toastify/dist/ReactToastify.css"
import Container from "react-bootstrap/Container"
import "../styles/index.css"
import { theme } from "../theme"
import createEmotionCache from "../utils/createEmotionCache"
import { CacheProvider, EmotionCache } from "@emotion/react"
import { createTheme, ThemeProvider } from "@mui/material/styles"

import { registerChartJs } from "../utils/registerChart"

registerChartJs()

interface AppProps extends AppInitialProps {
  Component: NextComponentType
  router: Router
  emotionCache: EmotionCache
}

// Context och andra providers används här.

const clientSideEmotionCache = createEmotionCache()

export default function App({
  emotionCache = clientSideEmotionCache,
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
        <ToastContainer position="bottom-right" autoClose={2000} />
      </ThemeProvider>
    </CacheProvider>
  )
}
