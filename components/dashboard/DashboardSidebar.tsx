import React, { ReactElement } from "react"
import { Box, Button, Divider, Drawer, IconButton, Tooltip, Typography, useMediaQuery } from "@mui/material"
import NextLink from "next/link"
import { useRouter } from "next/router"
import { useTheme } from "@mui/material/styles"

import { FaBriefcase, FaCog, FaHome, FaRegCalendarAlt, FaTasks, FaUser, FaUsers } from "react-icons/fa"
import { ImBooks } from "react-icons/im"
import { BsCollection, BsFillCollectionFill } from "react-icons/bs"
import { AiOutlineFundProjectionScreen } from "react-icons/ai"
import NavItem from "./NavItem"
import Link from "next/link"
import { MdQuiz, MdFeedback } from "react-icons/md"
import { IconType } from "react-icons"
import { UserModelSchemaType } from "../../schema/UserSchema"
import { RiMenuFoldFill } from "react-icons/ri"

interface SidbarNavItems {
  href: string
  icon: ReactElement<any, any>
  title: string
}

const items: SidbarNavItems[] = [
  {
    href: "/home",
    icon: <FaHome fontSize="small" />,
    title: "Home",
  },
  {
    href: "/calendar",
    icon: <FaRegCalendarAlt fontSize="small" />,
    title: "Calendar",
  },

  {
    href: "/courses",
    icon: <ImBooks fontSize="small" />,
    title: "My courses",
  },
  {
    href: "/projects",
    icon: <AiOutlineFundProjectionScreen fontSize="small" />,
    title: "My projects",
  },

  {
    href: "/tasks",
    icon: <FaTasks fontSize="small" />,
    title: "Tasks",
  },
  {
    href: "/resources",
    icon: <BsFillCollectionFill fontSize="small" />,
    title: "Resources",
  },
  {
    href: "/quizzes",
    icon: <MdQuiz fontSize="small" />,
    title: "Quizzes",
  },
  {
    href: "/profile",
    icon: <FaUser fontSize="small" />,
    title: "Profile",
  },
  /*
  {
    href: "/job-listing",
    icon: <FaBriefcase fontSize="small" />,
    title: "Job listing",
  },
  

  {
    href: "/study-rooms",
    icon: <FaUsers fontSize="small" />,
    title: "Study rooms",
  },
*/
  {
    href: "/settings",
    icon: <FaCog fontSize="small" />,
    title: "Settings",
  },
]

interface IProps {
  open: boolean
  onClose: () => void
  user: UserModelSchemaType
}

const DashboardSidebar = ({ open, onClose, user }: IProps) => {
  const theme = useTheme()
  const lgUp = useMediaQuery(theme.breakpoints.up("lg"))

  const content = (
    <>
      <Box>
        {!lgUp && (
          <IconButton
            onClick={onClose}
            sx={{
              color: "white",
              float: "right",
              marginTop: 1.5,
            }}
          >
            <RiMenuFoldFill />
          </IconButton>
        )}
      </Box>

      {/** ersätt med en logo, kanske ha en divider under */}
      <Box sx={{ margin: 2 }}>
        <Link style={{ textDecoration: "none" }} href="/" passHref>
          <Button size="large" color="primary" variant="contained">
            studify
          </Button>
        </Link>
      </Box>

      <Box
        sx={{
          marginTop: 4,
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

        <Box mb={2}>
          <Divider sx={{ backgroundColor: "#ffffff", marginLeft: 1, marginRight: 1, marginBottom: 1 }} />
          <NavItem key={"Feedback"} icon={<MdFeedback fontSize="small" />} href={"/feedback"} title={"Feedback"} />
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
            backgroundColor: "#ededed",
            background: "linear-gradient(195deg, rgb(66, 66, 74), rgb(25, 25,25))",
            width: 280,
            // borderRadius: 2,
            //margin: 2,
            //height: "calc(100vh - 2rem)",
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
          backgroundColor: "#ededed",
          background: "linear-gradient(195deg, rgb(66, 66, 74), rgb(25, 25,25))",
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
