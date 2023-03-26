import React from "react"
import InfoTooltip from "./Tooltip"

interface IProps {
  title: string
  toolTipText?: string
}

const CardHeaderTitle = ({ title, toolTipText }: IProps) => {
  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <span
        style={{
          fontWeight: 600,
          fontSize: "1.125rem",
          lineHeight: 1.375,
        }}
      >
        {title}
      </span>
      {toolTipText && <InfoTooltip text={toolTipText} />}
    </div>
  )
}

export default CardHeaderTitle
