import React, { useCallback } from "react"
import { styled } from "@mui/material/styles"
import { AppBar, Avatar, Badge, Box, IconButton, Toolbar, Tooltip } from "@mui/material"
import { RiMenuUnfoldFill } from "react-icons/ri"
import { FaBell, FaSignOutAlt, FaUser, FaUserCircle, FaUsers } from "react-icons/fa"
import { useCurrentUser } from "../../lib/hooks"
import { toast } from "react-toastify"
import { useRouter } from "next/router"
import { fetcher1 } from "../../lib/axiosFetcher"

const DashboardNavbarRoot = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[3],
}))

interface IProps {
  onSidebarOpen: () => void
}

export const DashboardNavbar = ({ onSidebarOpen }: IProps) => {
  const { mutate } = useCurrentUser()

  const router = useRouter()

  const onSignOut = useCallback(async () => {
    try {
      await fetcher1("/api/auth", {
        method: "DELETE",
      })
      toast.success("You have been signed out")
      mutate({ payload: null })
      router.replace("/")
    } catch (e: any) {
      toast.error(e.message)
    }
  }, [mutate])
  return (
    <>
      <DashboardNavbarRoot
        sx={{
          left: {
            lg: 270,
          },
          width: {
            lg: "calc(100% - 270px)",
          },
        }}
      >
        <Toolbar
          disableGutters
          sx={{
            minHeight: 64,
            left: 0,
            px: 2,
          }}
        >
          <IconButton
            onClick={onSidebarOpen}
            sx={{
              display: {
                xs: "inline-flex",
                lg: "none",
              },
            }}
          >
            <RiMenuUnfoldFill />
          </IconButton>

          <Box sx={{ flexGrow: 1 }} />
          <Tooltip title="Share profile">
            <IconButton sx={{ ml: 1 }}>
              <FaUsers />
            </IconButton>
          </Tooltip>
          <Tooltip title="Notifications">
            <IconButton sx={{ ml: 1 }}>
              <Badge badgeContent={4} color="primary" variant="dot">
                <FaBell />
              </Badge>
            </IconButton>
          </Tooltip>
          <Tooltip title="Sign out">
            <IconButton onClick={onSignOut} sx={{ ml: 1 }}>
              <FaSignOutAlt />
            </IconButton>
          </Tooltip>
          <Avatar style={{ marginLeft: 10 }} src="/static/images/avatars/avatar_1.png">
            <FaUserCircle />
          </Avatar>
        </Toolbar>
      </DashboardNavbarRoot>
    </>
  )
}
