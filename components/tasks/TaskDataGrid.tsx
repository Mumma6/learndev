import React from "react"
import Box from "@mui/material/Box"
import Chip from "@mui/material/Chip"
import { DataGrid, GridApi, GridColDef, GridEditCellValueParams, GridValueGetterParams } from "@mui/x-data-grid"

import ClearIcon from "@mui/icons-material/Clear"

import { FaArrowRight, FaTrash, FaCheck } from "react-icons/fa"
import { IconButton } from "@mui/material"
import { TaskModelType } from "../../schema/TaskSchema"
import { pipe } from "fp-ts/lib/function"
import * as O from "fp-ts/Option"
import * as A from "fp-ts/Array"
import { useRouter } from "next/router"

interface IProps {
  tasks: TaskModelType[] | null | undefined
  deleteTask: (id: string) => void
  toggleTask: (id: string, completed: boolean) => void
}

const TaskDataGrid = ({ tasks, deleteTask, toggleTask }: IProps) => {
  const router = useRouter()

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
      headerName: "",
      flex: 1,
      // width: 150,
      sortable: false,
      renderCell: (params) => {
        const currentRow = params.row

        const onClickToggle = (e: any) => {
          toggleTask(currentRow._id, !currentRow.completed)
        }

        const onClickDelete = (e: any) => {
          deleteTask(currentRow._id)
        }

        const onClickGoTo = (e: any) => {
          router.push(`/${currentRow.activityGroup?.toLocaleLowerCase()}/${currentRow?.activityId}`)
        }

        return (
          <>
            <IconButton disabled={!currentRow.activityId} onClick={onClickGoTo} color="primary">
              <FaArrowRight />
            </IconButton>
            <IconButton color={currentRow.completed ? "info" : "success"} size="small" onClick={onClickToggle}>
              {currentRow.completed ? <ClearIcon /> : <FaCheck />}
            </IconButton>
            <IconButton onClick={onClickDelete} color="error" edge="end" aria-label="delete">
              <FaTrash />
            </IconButton>
          </>
        )
      },
    },
  ]

  type TTaskModelType = TaskModelType & { id: string }

  const mapT = (task: TaskModelType): TTaskModelType => ({ ...task, id: task._id })

  // sortera på completed och title
  const mappedTasks = pipe(
    tasks,
    O.fromNullable,
    O.map(A.map(mapT)),
    O.map((d) =>
      d.sort((at, bt) => (at.completed === bt.completed ? at.title.localeCompare(bt.title) : at.completed ? 1 : -1))
    ),
    O.getOrElse<Array<TTaskModelType>>(() => [])
  )

  return (
    <Box sx={{ height: 600, width: "100%" }}>
      <DataGrid
        rows={mappedTasks}
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
