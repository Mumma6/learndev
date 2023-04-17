import React from "react"
import Box from "@mui/material/Box"
import Chip from "@mui/material/Chip"
import { DataGrid, GridApi, GridColDef, GridEditCellValueParams, GridValueGetterParams } from "@mui/x-data-grid"
import Button from "@mui/material/Button"
import CheckIcon from "@mui/icons-material/Check"
import CloseIcon from "@mui/icons-material/Close"
import DeleteIcon from "@mui/icons-material/Delete"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"
import { Stack } from "@mui/material"
import { FaArrowRight } from "react-icons/fa"
import { TaskModelType } from "../../schema/TaskSchema"

interface IProps {
  tasks: TaskModelType[]
  deleteTask: (id: string) => void
  toggleTask: (id: string, completed: boolean) => void
}

const TaskDataGrid = ({ tasks, deleteTask, toggleTask }: IProps) => {
  const columns: GridColDef[] = [
    {
      field: "title",
      headerName: "Title",
      flex: 1,
      // width: 150,
    },
    {
      field: "activityGroup",
      headerName: "Activity group",
      flex: 1,
      // width: 150,
    },
    {
      field: "activityName",
      headerName: "Activity",
      flex: 1,
      // width: 150,
    },
    {
      field: "createdAt",
      headerName: "Created at",
      flex: 1,
      // width: 110,
      // editable: true,
    },
    {
      field: "prio",
      headerName: "Prio",
      flex: 1,
      // width: 110,
      renderCell: (params) => {
        const currentRow = params.row

        return (
          <Chip
            label={currentRow.prio}
            color={currentRow.prio === "Low" ? "default" : currentRow.prio === "High" ? "error" : "info"}
          />
        )
      },
      sortComparator: (v1, v2) => v1.localeCompare(v2),
      valueGetter: (params) => params.row.prio,
    },

    {
      field: "toggle",
      headerName: "Toggle complete",
      flex: 1,
      // width: 150,
      sortable: false,
      renderCell: (params) => {
        const currentRow = params.row

        const onClick = (e: any) => {
          toggleTask(currentRow._id, !currentRow.completed)
        }

        return (
          <Button variant="contained" color={currentRow.completed ? "info" : "success"} size="small" onClick={onClick}>
            {currentRow.completed ? <CloseIcon /> : <CheckIcon />}
          </Button>
        )
      },
    },
    {
      field: "goto",
      headerName: "Go to",
      flex: 1,
      // width: 150,
      sortable: false,
      renderCell: (params) => {
        const currentRow = params.row
        const onClick = (e: any) => {
          return alert(JSON.stringify(currentRow, null, 4))
        }

        return (
          <Button size="small" variant="contained" color="primary">
            <ArrowForwardIcon />
          </Button>
        )
      },
    },
    {
      field: "delete",
      headerName: "Delete",
      flex: 1,
      // width: 150,
      sortable: false,
      renderCell: (params) => {
        const onClick = (e: any) => {
          const currentRow = params.row
          deleteTask(currentRow._id)
        }

        return (
          <Button variant="contained" color="error" size="small" onClick={onClick}>
            <DeleteIcon />
          </Button>
        )
      },
    },
  ]

  const mappedTasks = (ts: TaskModelType[]) =>
    ts.map((task) => ({
      ...task,
      id: task._id,
    }))

  return (
    <Box sx={{ height: 600, width: "100%" }}>
      <DataGrid
        rows={mappedTasks(tasks)}
        sx={{
          "& .super-app-theme--true": {
            bgcolor: () => "#9e9e9e",
            "&:hover": {
              backgroundColor: "#9e9e9e",
            },
          },
          "& .super-app-theme--false": {
            bgcolor: () => "white",
          },
        }}
        getRowClassName={(params) => `super-app-theme--${params.row.completed}`}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        pageSizeOptions={[10]}
        disableRowSelectionOnClick
      />
    </Box>
  )
}

export default TaskDataGrid
