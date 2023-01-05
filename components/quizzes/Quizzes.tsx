import React from "react"
import {
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  SvgIcon,
  Typography,
  Container,
} from "@mui/material"
import { FaSearch } from "react-icons/fa"
import { useQuizzes } from "../../lib/hooks"
import QuizzesCard from "./QuizzesCard"
import { IQuestion } from "../../models/Quiz"

const Quizzes = () => {
  const { data } = useQuizzes()

  // Hämta user
  // Alla quizzes som är completede ska inte gå att välja. Visa istället vilken poäng dom fått.
  // Misslyckade quizzes ska kunna göras om efter en månad?

  return (
    <>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth={false}>
          <Box>
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
                Quizzes
              </Typography>
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
                <Grid item key={quiz._id} lg={3} md={3} sm={6} xs={12}>
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
