import React from "react"
import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  InputAdornment,
  SvgIcon,
  TextField
} from "@mui/material"
import { FaSearch } from "react-icons/fa"
import { useQuizzes } from "../../lib/hooks"
import QuizzesCard from "./QuizzesCard"

const Quizzes = () => {
  const { data } = useQuizzes()

  return (
    <>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
          marginTop: 5
        }}
      >
        <Container maxWidth={false}>
          <Box>
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
                        )
                      }}
                      placeholder="Search quiz"
                      variant="outlined"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Box>
          <Box sx={{ pt: 3 }}>
            <Grid container spacing={3}>
              {data?.payload?.map((quiz) => (
                <Grid item key={quiz._id.toString()} lg={4} md={4} sm={6} xs={12}>
                  <QuizzesCard quiz={quiz} />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      </Box>
    </>
  )
}

export default Quizzes
