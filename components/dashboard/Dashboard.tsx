import React from "react"
import { IUser } from "../../types/user"
import { Button, Typography } from "@mui/material"

interface IProps {
  user: IUser
}
const Dashboard = ({ user }: IProps) => {
  console.log(user)
  return (
    <>
      <Typography>sammafanttning</Typography>
      <Button color="secondary">Secondary</Button>
      <Button color="primary">primary</Button>
    </>
  )
}

export default Dashboard
