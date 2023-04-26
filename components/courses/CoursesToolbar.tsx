import React, { useEffect, useState } from "react"
import { Box, Button, Card, CardContent, TextField, InputAdornment, SvgIcon, Typography } from "@mui/material"
import { FaSearch } from "react-icons/fa"
import { SetState } from "../../types/generics"

interface IProps {
  handleClickOpen: () => void
  searchInput: string
  setSearchInput: SetState<string>
}

const CoursesToolbar = ({ handleClickOpen, searchInput, setSearchInput }: IProps) => {
  return (
    <Box mt={1} mb={1}>
      <Box sx={{ mt: 3 }}>
        <Card>
          <CardContent>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Box>
                <TextField
                  fullWidth
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
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
