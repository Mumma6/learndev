import React from "react"
import { Box, Button, Card, CardContent, TextField, InputAdornment, SvgIcon, Typography } from "@mui/material"
import { FaSearch } from "react-icons/fa"

interface IProps {
  handleClickOpen: () => void
}

const CoursesToolbar = ({ handleClickOpen }: IProps) => {
  return (
    <Box mt={2} mb={2}>
      <Box
        sx={{
          alignItems: "center",
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          m: -1,
        }}
      >
        <Typography sx={{ m: 1 }} variant="h4">
          Courses
        </Typography>
        <Box sx={{ m: 1 }}>
          <Button color="primary" variant="contained" onClick={handleClickOpen}>
            Add course
          </Button>
        </Box>
      </Box>
      <Box sx={{ mt: 3 }}>
        <Card>
          <CardContent>
            <Box sx={{ maxWidth: 500 }}>
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
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}

export default CoursesToolbar
