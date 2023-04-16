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
    field: "created",
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
    headerName: "Toggle task",
    flex: 1,
    // width: 150,
    sortable: false,
    renderCell: (params) => {
      const currentRow = params.row
      const onClick = (e: any) => {
        return alert(JSON.stringify(currentRow, null, 4))
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
        return alert(JSON.stringify(currentRow, null, 4))
      }

      return (
        <Button variant="contained" color="error" size="small" onClick={onClick}>
          <DeleteIcon />
        </Button>
      )
    },
  },

  // lägg till en colum för completed också. Yes or No. Chip.
  // lägg den brevid toggle knappen. Dom två ska ligga i samma rendercell
  // delete ska få en egen.
]

const exampleDataRows = [
  {
    id: 1,
    title: "todo1",
    activityGroup: "Projects",
    activityName: "Hemsida1",
    created: "2022-01-02",
    prio: "High",
  },
  {
    id: 2,
    title: "todo2",
    activityGroup: "None",
    activityName: "None",
    created: "2022-01-02",
    prio: "Low",
    completed: true,
  },
  {
    id: 3,
    title: "todo2",
    activityGroup: "Courses",
    activityName: "Course X",
    created: "2022-01-02",
    prio: "Medium",
    completed: false,
  },
]

const TaskDataGrid = () => {
  return (
    <Box sx={{ height: 600, width: "100%" }}>
      <DataGrid
        rows={exampleDataRows}
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
