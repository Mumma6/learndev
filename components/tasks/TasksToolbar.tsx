import React, { useState } from "react"
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  SvgIcon,
  Typography,
  FormGroup,
  FormControlLabel,
} from "@mui/material"
import { FaSearch } from "react-icons/fa"
import Switch from "@mui/material/Switch"
import { SetState } from "../../types/generics"

interface IProps {
  handleClickOpen: () => void
  setShowCompleted: SetState<boolean>
  showCompleted: boolean
}

const TasksToolbar = ({ handleClickOpen, showCompleted, setShowCompleted }: IProps) => {
  return (
    <Box mt={1} mb={1}>
      <Box sx={{ mt: 3 }}>
        <Card>
          <CardContent>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Box>
                <TextField
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SvgIcon fontSize="small" color="action">
                          <FaSearch />
                        </SvgIcon>
                      </InputAdornment>
                    ),
                  }}
                  placeholder="Search task"
                  variant="outlined"
                />
              </Box>
              <div style={{ display: "flex" }}>
                <FormGroup style={{ alignSelf: "center" }}>
                  <FormControlLabel
                    control={<Switch checked={showCompleted} onChange={() => setShowCompleted(!showCompleted)} />}
                    label={showCompleted ? "Hide completed" : "Show completed"}
                  />
                </FormGroup>
                <Button sx={{ marginLeft: 1 }} color="primary" variant="contained" onClick={handleClickOpen}>
                  Add task
                </Button>
              </div>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}

export default TasksToolbar
