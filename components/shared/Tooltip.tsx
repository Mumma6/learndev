import React from "react"
import Tooltip from "@mui/material/Tooltip"
import { IconButton } from "@mui/material"
import HelpOutlineIcon from "@mui/icons-material/HelpOutline"

interface IProps {
  text: string
}

const InfoTooltip = ({ text }: IProps) => {
  return (
    <Tooltip placement="top" disableFocusListener title={text}>
      <IconButton color="info" style={{ padding: 0, margin: 0 }}>
        <HelpOutlineIcon />
      </IconButton>
    </Tooltip>
  )
}

export default InfoTooltip
