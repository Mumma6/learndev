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

/*

title: string
description: string om den får plats
type: färkodat chip + typen
link: knapp ifall den inte är tom
edit: knapp som öppnar en modal. Resurser ska man kunna ändra mer än tasks
delete: knapp

*/

const ResourcesDataGrid = () => {
  const columns: GridColDef[] = [
    {
      field: "title",
      headerName: "Title",
      flex: 0.7,
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

        return <Chip label={currentRow.type} style={{ backgroundColor: getResourceTypeColor(currentRow.type) }} />
      },
      sortComparator: (v1, v2) => v1.localeCompare(v2),
      valueGetter: (params) => params.row.prio,
    },
  ]

  return <div>ResourcesDataGrid</div>
}

export default ResourcesDataGrid
