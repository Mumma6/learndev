import { useEffect, useState } from "react"
import { Box, CircularProgress, Container } from "@mui/material"
import { styled } from "@mui/material/styles"
import DashboardSidebar from "./DashboardSidebar"
import { DashboardNavbar } from "./DashboardNavbar"
import { useCurrentUser } from "../../lib/hooks"
import { useRouter } from "next/router"

const DashboardLayoutRoot = styled("div")(({ theme }) => ({
  display: "flex",
  flex: "1 1 auto",
  maxWidth: "100%",
  paddingTop: 64,
  [theme.breakpoints.up("lg")]: {
    paddingLeft: 280,
  },
}))

interface IProps {
  children: JSX.Element[] | JSX.Element
}

export const DashboardLayout = ({ children }: IProps) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true)

  const { data } = useCurrentUser()

  const router = useRouter()

  useEffect(() => {
    if (data?.payload === null) {
      router.replace("/")
    }
  }, [router, data])

  if (!data?.payload)
    return (
      <Container>
        <CircularProgress />
      </Container>
    )

  return (
    <>
      <DashboardLayoutRoot>
        <Box
          sx={{
            display: "flex",
            flex: "1 1 auto",
            flexDirection: "column",
            width: "100%",
          }}
        >
          {children}
        </Box>
      </DashboardLayoutRoot>
      <DashboardNavbar onSidebarOpen={() => setSidebarOpen(true)} />
      <DashboardSidebar user={data.payload} onClose={() => setSidebarOpen(false)} open={isSidebarOpen} />
    </>
  )
}
