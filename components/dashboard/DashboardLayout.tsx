import { useEffect, useState } from "react"
import { Box, CircularProgress } from "@mui/material"
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
  children: JSX.Element[]
}

export const DashboardLayout = ({ children }: IProps) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true)

  const { data, error } = useCurrentUser()

  console.log(data)

  const router = useRouter()

  useEffect(() => {
    if (data?.payload === null) {
      router.replace("/")
    }
  }, [router, data, error])

  if (!data?.payload) return <CircularProgress />
  if (!data && !error) return <CircularProgress />

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
