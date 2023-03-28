import React from "react"
import Box from "@mui/material/Box"
import Chip from "@mui/material/Chip"
import { DataGrid, GridApi, GridColDef, GridEditCellValueParams, GridValueGetterParams } from "@mui/x-data-grid"
import Button from "@mui/material/Button"
import CheckIcon from "@mui/icons-material/Check"
import CloseIcon from "@mui/icons-material/Close"
import DeleteIcon from "@mui/icons-material/Delete"
import { Stack } from "@mui/material"

const columns: GridColDef[] = [
  {
    field: "title",
    headerName: "Title",
    width: 150,
  },
  {
    field: "activityGroup",
    headerName: "Activity group",
    width: 150,
  },
  {
    field: "created",
    headerName: "Created at",
    width: 110,
    // editable: true,
  },
  {
    field: "prio",
    headerName: "Prio",
    width: 110,
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
    headerName: "Actions",
    width: 250,
    sortable: false,
    renderCell: (params) => {
      const onClick = (e: any) => {
        // behöver uppdatera samt

        const currentRow = params.row
        return alert(JSON.stringify(currentRow, null, 4))
      }

      // better colors

      if (!params.row.completed) {
        return (
          <Stack direction="row" spacing={2}>
            <Button size="small" variant="contained" color="success">
              <CheckIcon />
            </Button>
            <Button variant="contained" color="error" size="small" onClick={onClick}>
              <DeleteIcon />
            </Button>
          </Stack>
        )
      }

      return (
        <Stack direction="row" spacing={2}>
          <Button size="small" variant="contained" color="info">
            <CloseIcon />
          </Button>
          <Button variant="contained" color="error" size="small" onClick={onClick}>
            <DeleteIcon />
          </Button>
        </Stack>
      )
    },
  },
  /*
  {
    field: "delete",
    headerName: "Delete",
    width: 150,
    sortable: false,
    renderCell: (params) => {
      const onClick = (e: any) => {
        const currentRow = params.row
        return alert(JSON.stringify(currentRow, null, 4))
      }

      return (
        <Button variant="contained" color="error" size="small" onClick={onClick}>
          Delete
        </Button>
      )
    },
  },
  */

  // lägg till en colum för completed också. Yes or No. Chip.
  // lägg den brevid toggle knappen. Dom två ska ligga i samma rendercell
  // delete ska få en egen.
]

const rows = [
  {
    id: 1,
    title: "todo1",
    activityGroup: "Projects",
    created: "2022-01-02",
    prio: "High",
  },
  {
    id: 2,
    title: "todo2",
    activityGroup: "None",
    created: "2022-01-02",
    prio: "Low",
    completed: true,
  },
  {
    id: 3,
    title: "todo2",
    activityGroup: "Courses",
    created: "2022-01-02",
    prio: "Medium",
    completed: false,
  },
]

const TaskDataGrid = () => {
  return (
    <Box sx={{ height: 600, width: "100%" }}>
      <DataGrid
        rows={rows}
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
