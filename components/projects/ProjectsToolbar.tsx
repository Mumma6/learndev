import React from "react"
import { Box, Button, Card, CardContent, InputAdornment, SvgIcon, TextField } from "@mui/material"
import { FaSearch } from "react-icons/fa"

interface IProps {
  handleClickOpen: () => void
}

// create a generic component instead, this is copy paste from CoursesToolBar.
const ProjectsToolbar = ({ handleClickOpen }: IProps) => {
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
                    )
                  }}
                  placeholder="Search project"
                  variant="outlined"
                />
              </Box>

              <Button sx={{ marginLeft: 1 }} color="primary" variant="contained" onClick={handleClickOpen}>
                Add project
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}

export default ProjectsToolbar
