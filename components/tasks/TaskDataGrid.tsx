import React, { useState } from "react"
import Box from "@mui/material/Box"
import Chip from "@mui/material/Chip"
import { DataGrid, type GridColDef } from "@mui/x-data-grid"
import format from "date-fns/format"

import { FaArrowRight, FaCheck, FaInfoCircle, FaPlus, FaTrash } from "react-icons/fa"
import { IconButton } from "@mui/material"
import { type TaskModelType } from "../../schema/TaskSchema"
import { pipe } from "fp-ts/lib/function"
import * as O from "fp-ts/Option"
import * as A from "fp-ts/Array"
import * as Ord from "fp-ts/Ord"
import * as string from "fp-ts/string"
import * as boolean from "fp-ts/boolean"
import { useRouter } from "next/router"
import { TaskInfoModal } from "./TaskInfoModal"

interface IProps {
  tasks: TaskModelType[] | null | undefined
  deleteTask: (id: string) => void
  toggleTask: (id: string, completed: boolean) => void
}

const TaskDataGrid = ({ tasks, deleteTask, toggleTask }: IProps) => {
  const [showModal, setShowModal] = useState(false)
  const [infoTask, setInfoTask] = useState<TaskModelType | undefined>(undefined)
  const router = useRouter()

  const onCloseInfoModal = () => {
    setShowModal(false)
    setInfoTask(undefined)
  }

  const columns: GridColDef[] = [
    {
      field: "title",
      headerName: "Title",
      flex: 0.7
      // width: 150,
    },
    {
      field: "activityGroup",
      headerName: "Activity group",
      flex: 0.7
      // width: 150,
    },
    {
      field: "activityName",
      headerName: "Activity",
      flex: 0.5
      // width: 150,
    },
    {
      field: "createdAt",
      headerName: "Created at",
      flex: 0.7,
      renderCell: (params) => {
        const currentRow = params.row

        return <p>{format(new Date(currentRow.createdAt), "yyyy-MM-dd hh:mm")}</p>
      },
      sortComparator: (v1, v2) => v1.localeCompare(v2),
      valueGetter: (params) => params.row.createdAt
      // width: 110,
      // editable: true,
    },
    {
      field: "prio",
      headerName: "Prio",
      flex: 0.5,
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
      valueGetter: (params) => params.row.prio
    },

    {
      field: "toggle",
      headerName: "",
      flex: 1,
      // width: 150,
      sortable: false,
      renderCell: (params) => {
        const currentRow = params.row

        const onClickToggle = (_e: any) => {
          toggleTask(currentRow._id, !currentRow.completed)
        }

        const onClickDelete = (_e: any) => {
          deleteTask(currentRow._id)
        }

        const onClickInfo = (_e: any) => {
          setShowModal(true)
          setInfoTask(tasks?.find((task) => task._id === currentRow._id))
        }

        const onClickGoTo = (_e: any) => {
          router.push(`/${currentRow.activityGroup?.toLocaleLowerCase()}/${currentRow?.activityId}`)
        }

        return (
          <>
            <IconButton sx={{ marginRight: 2 }} onClick={onClickInfo} color="info">
              <FaInfoCircle />
            </IconButton>
            <IconButton sx={{ marginRight: 2 }} disabled={!currentRow.activityId} onClick={onClickGoTo} color="primary">
              <FaArrowRight />
            </IconButton>
            <IconButton
              sx={{ marginRight: 2 }}
              color={currentRow.completed ? "info" : "success"}
              size="small"
              onClick={onClickToggle}
            >
              {currentRow.completed ? <FaPlus /> : <FaCheck />}
            </IconButton>
            <IconButton onClick={onClickDelete} color="error" edge="end" aria-label="delete">
              <FaTrash />
            </IconButton>
          </>
        )
      }
    }
  ]

  type TTaskModelType = TaskModelType & { id: string }

  const mapT = (task: TaskModelType): TTaskModelType => ({ ...task, id: task._id })

  const taskOrd = Ord.contramap((x: TTaskModelType) => x.completed)(boolean.Ord)
  const titleOrd = Ord.contramap((x: TTaskModelType) => x.title)(string.Ord)

  const S = Ord.getSemigroup<TTaskModelType>()

  const taskTitleOrd = S.concat(taskOrd, titleOrd)

  const mappedTasks = pipe(
    tasks,
    O.fromNullable,
    O.map(A.map(mapT)),
    O.map(A.sort(taskTitleOrd)),
    O.getOrElse<TTaskModelType[]>(() => [])
  )

  return (
    <Box sx={{ height: 600, width: "100%" }}>
      <TaskInfoModal open={showModal} task={infoTask} handleClose={onCloseInfoModal} />
      <DataGrid
        rows={mappedTasks}
        sx={{
          "& .super-app-theme--true": {
            bgcolor: () => "#c4c4c4",
            "&:hover": {
              backgroundColor: "#c4c4c4"
            }
          },
          "& .super-app-theme--false": {
            bgcolor: () => "white"
          }
        }}
        getRowClassName={(params) => `super-app-theme--${params.row.completed}`}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10
            }
          }
        }}
        pageSizeOptions={[10]}
        disableRowSelectionOnClick
      />
    </Box>
  )
}

export default TaskDataGrid
