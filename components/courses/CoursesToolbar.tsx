import React from "react"
import { Box, Button, Card, CardContent, TextField, InputAdornment, SvgIcon, Typography } from "@mui/material"
import { FaSearch } from "react-icons/fa"

interface IProps {
  handleClickOpen: () => void
}

const CoursesToolbar = ({ handleClickOpen }: IProps) => {
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
                  placeholder="Search course"
                  variant="outlined"
                />
              </Box>

              <Button sx={{ marginLeft: 1 }} color="primary" variant="contained" onClick={handleClickOpen}>
                Add course
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}

export default CoursesToolbar
