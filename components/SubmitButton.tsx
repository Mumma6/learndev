import React from "react"
import { Spinner } from "react-bootstrap"
import { Button } from "@mui/material"

interface IProps {
  isLoading: boolean
  text: string
  isDisabled?: boolean
  fullWidth?: boolean
  size?: "large" | "small" | "medium" | undefined
  customStyle?: Object
  color?: "primary" | "inherit" | "secondary" | "success" | "error" | "info" | "warning" | undefined
}

const SubmitButton = ({
  isLoading,
  text,
  isDisabled = false,
  fullWidth = true,
  size = "large",
  customStyle = {},
  color = "primary",
}: IProps) => {
  return isLoading ? (
    <Button
      style={customStyle}
      color={color}
      disabled={isDisabled}
      fullWidth={fullWidth}
      size={size}
      type="submit"
      variant="contained"
    >
      <Spinner style={{ marginRight: 5 }} animation="border" as="span" size="sm" role="status" aria-hidden="true" />
      Loading...
    </Button>
  ) : (
    <Button
      style={customStyle}
      color={color}
      disabled={isDisabled}
      fullWidth={fullWidth}
      size="large"
      type="submit"
      variant="contained"
    >
      {text}
    </Button>
  )
}

export default SubmitButton
