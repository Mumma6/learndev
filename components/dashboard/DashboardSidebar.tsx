import React from "react"
import { Box, Button, Divider, Drawer, Typography, useMediaQuery } from "@mui/material"
import NextLink from "next/link"
import { useRouter } from "next/router"
import { useTheme } from "@mui/material/styles"

import { FaCog, FaHome, FaUser } from "react-icons/fa"
import NavItem from "./NavItem"
import Link from "next/link"

const items = [
  {
    href: "/dashboard",
    icon: <FaHome fontSize="small" />,
    title: "Home",
  },
  {
    href: "/courses",
    icon: <FaCog fontSize="small" />,
    title: "Courses",
  },
  {
    href: "/learning-path",
    icon: <FaCog fontSize="small" />,
    title: "Learning path",
  },
  {
    href: "/profile",
    icon: <FaCog fontSize="small" />,
    title: "Profile",
  },
  {
    href: "/planning",
    icon: <FaCog fontSize="small" />,
    title: "Planning",
  },
  {
    href: "/settings",
    icon: <FaCog fontSize="small" />,
    title: "Settings",
  },
]

interface IProps {
  open: boolean
  onClose: () => void
}

const DashboardSidebar = ({ open, onClose }: IProps) => {
  const theme = useTheme()
  const lgUp = useMediaQuery(theme.breakpoints.up("lg"))

  const content = (
    <>
      <Box sx={{ margin: 2 }}>
        <Link style={{ textDecoration: "none" }} href="/" passHref>
          <Button size="large" color="primary" variant="contained">
            LOGO
          </Button>
        </Link>
      </Box>

      <Box
        sx={{
          marginTop: 5,
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <Box sx={{ flexGrow: 1 }}>
          {items.map((item) => (
            <NavItem key={item.title} icon={item.icon} href={item.href} title={item.title} />
          ))}
        </Box>
      </Box>
    </>
  )

  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open
        PaperProps={{
          sx: {
            color: "#FFFFFF",
            width: 280,
          },
        }}
        variant="permanent"
      >
        {content}
      </Drawer>
    )
  }

  return (
    <Drawer
      anchor="left"
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          color: "#FFFFFF",
          width: 280,
        },
      }}
      sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
      variant="temporary"
    >
      {content}
    </Drawer>
  )
}

export default DashboardSidebar
