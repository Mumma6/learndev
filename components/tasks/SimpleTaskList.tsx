import React from "react"
import {
  Chip,
  IconButton,
  Paper,
  Typography
} from "@mui/material"
import ClearIcon from "@mui/icons-material/Clear"
import { FaCheck } from "react-icons/fa"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import { type TaskModelType } from "../../schema/TaskSchema"

interface IProps {
  dataToShow: TaskModelType[]
  toggleTask: (id: string, completed: boolean) => void
}

const SimpleTaskList = ({ dataToShow, toggleTask }: IProps) => {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Prio</TableCell>
            <TableCell>Mark as done</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {dataToShow.map((task) => (
            <TableRow
              key={task._id}
              sx={{
                "&:last-child td, &:last-child th": { border: 0 },
                backgroundColor: task.completed ? "#c4c4c4" : null
              }}
            >
              <TableCell component="th" scope="row">
                <Typography>{task.title}</Typography>
              </TableCell>
              <TableCell>
                <Chip label={task.completed ? "Completed" : "In progess"} color={task.completed ? "success" : "info"} />
              </TableCell>
              <TableCell>
                <Chip label={task.prio} color={task.prio === "Low" ? "default" : task.prio === "High" ? "error" : "info"} />
              </TableCell>
              <TableCell>
                <IconButton
                  onClick={() => { toggleTask(task._id, !task.completed) }}
                  color={task.completed ? "info" : "success"}
                  size="small"
                >
                  {task.completed ? <ClearIcon /> : <FaCheck />}
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default SimpleTaskList
