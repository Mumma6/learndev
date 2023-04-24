import React, { useState } from "react"
import { DataGrid, GridApi, GridColDef, GridEditCellValueParams, GridValueGetterParams } from "@mui/x-data-grid"
import { FiExternalLink } from "react-icons/fi"
import {
  Box,
  Paper,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Container,
  Button,
  Typography,
  Chip,
  IconButton,
  Grid,
} from "@mui/material"
import { getResourceTypeColor } from "../../helpers/helpers"
import { useRouter } from "next/router"

import * as TE from "fp-ts/TaskEither"
import { toast } from "react-toastify"
import { fetcherTE } from "../../lib/axiosFetcher"
import { useSWRConfig } from "swr"

import { pipe } from "fp-ts/lib/function"
import * as O from "fp-ts/Option"
import * as A from "fp-ts/Array"
import { FaPen, FaTrash } from "react-icons/fa"
import { ResourceModelInputSchemaType, ResourceModelSchemaType } from "../../schema/ResourceSchema"

/*

title: string
description: string om den får plats
type: färkodat chip + typen
link: knapp ifall den inte är tom
edit: knapp som öppnar en modal. Resurser ska man kunna ändra mer än tasks
delete: knapp

*/

const rows = [
  {
    id: 1,
    title: "res 1",
    description: "descrtiption för n 1",
    link: "/google.com",
    type: "Podcast",
  },
  {
    id: 12,
    title: "res 2",
    description: "descrtiption för n 2",
    link: "",
    type: "Website",
  },
  {
    id: 11,
    title: "res 3",
    description: "descrtiption för n 3",
    link: "/google.com",
    type: "Forum",
  },
  {
    id: 112,
    title: "res 4",
    description: "descrtiption för n 4",
    link: "/google.com",
    type: "Book",
  },
  {
    id: 1121,
    title: "res 5",
    description: "descrtiption för n 4",
    link: "/google.com",
    type: "Blog",
  },
  {
    id: 1124,
    title: "res 5",
    description: "descrtiption för n 4",
    link: "/google.com",
    type: "Tutorial",
  },
  {
    id: 11241,
    title: "res 5",
    description: "descrtiption för n 4",
    link: "/google.com",
    type: "Article",
  },
  {
    id: 112411,
    title: "res 5",
    description: "descrtiption för n 4",
    link: "/google.com",
    type: "Code repository",
  },
  {
    id: 1124111,
    title: "res 5",
    description: "descrtiption för n 4",
    link: "/google.com",
    type: "Cheat sheet",
  },
]

interface IProps {
  resources: ResourceModelSchemaType[] | null | undefined
}

const ResourcesDataGrid = ({ resources }: IProps) => {
  const router = useRouter()
  const { mutate } = useSWRConfig()
  type TResourceModelSchemaType = ResourceModelSchemaType & { id: string }
  const addId = (resource: ResourceModelSchemaType): TResourceModelSchemaType => ({ ...resource, id: resource._id })

  const data = pipe(
    resources,
    O.fromNullable,
    O.map(A.map(addId)),
    O.getOrElse<Array<TResourceModelSchemaType>>(() => [])
  )

  const deleteResource = async (id: string) => {
    pipe(
      fetcherTE(`/api/resources?id=${id}`, { method: "DELETE" }),
      TE.fold(
        (error) => {
          toast.error(error)
          return TE.left(error)
        },
        (response) => {
          mutate("/api/resources")
          toast.success(response?.message)
          return TE.right(response)
        }
      )
    )()
  }

  const columns: GridColDef[] = [
    {
      field: "title",
      headerName: "Title",
      flex: 0.4,
      // width: 150,
    },
    {
      field: "description",
      headerName: "Description",
      flex: 0.7,
      // width: 150,
    },
    {
      field: "type",
      headerName: "Resource type",
      flex: 0.5,
      // width: 110,
      renderCell: (params) => {
        const currentRow = params.row
        return (
          <Chip label={currentRow.type} style={{ backgroundColor: getResourceTypeColor(currentRow.type), color: "white" }} />
        )
      },
    },

    {
      field: "actions",
      headerName: "",
      flex: 0.6,
      // width: 150,
      sortable: false,
      renderCell: (params) => {
        const currentRow = params.row

        const onClickEdit = (e: any) => {
          //toggleTask(currentRow._id, !currentRow.completed)
          console.log("edit")
        }

        const onClickDelete = (e: any) => {
          deleteResource(currentRow._id)
        }

        const onClickGoTo = (e: any) => {
          router.push(`/${currentRow.link}`)
        }

        return (
          <Box>
            <IconButton sx={{ marginRight: 2 }} color="primary" onClick={onClickGoTo} disabled={!currentRow.link}>
              <FiExternalLink />
            </IconButton>

            <IconButton sx={{ marginRight: 2, fontSize: 20 }} onClick={onClickEdit} color="info">
              <FaPen />
            </IconButton>

            <IconButton sx={{ fontSize: 20 }} onClick={onClickDelete} color="error" edge="end" aria-label="delete">
              <FaTrash />
            </IconButton>
          </Box>
        )
      },
    },
  ]

  return (
    <Box sx={{ height: 600, width: "100%" }}>
      <DataGrid
        rows={data}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        sx={{
          display: "flex",
          justifyContent: "center",
          textAlign: "center",
        }}
        pageSizeOptions={[10]}
        disableRowSelectionOnClick
      />
    </Box>
  )
}

export default ResourcesDataGrid
