import React from "react"
import { IQuestion, IQuiz } from "../../models/Quiz"
import { Box, Paper, Card, CardContent, CardHeader, Divider, Container, Button } from "@mui/material"
import SubmitButton from "../SubmitButton"
import { FaArrowLeft, FaArrowRight } from "react-icons/fa"
import NextLink from "next/link"
import Question from "./Question"
import { useCurrentUser } from "../../lib/hooks"

interface IProps {
  quiz: IQuiz
}

const Quiz = ({ quiz }: IProps) => {
  const { data } = useCurrentUser()
  const { title, questions, passingScore } = quiz

  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [currentQuestion, setCurrentQuestion] = React.useState<IQuestion>(questions[currentIndex])

  const [choosenAnwserKey, setChoosenAnwserKey] = React.useState<number | null>(null)
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChoosenAnwserKey(Number(event.target.value))
  }

  const [score, setScore] = React.useState(0)

  const setNextQuestion = () => {
    if (currentIndex === questions.length) {
      return
    } else {
      if (choosenAnwserKey === currentQuestion.correctAnswer) {
        setScore((score) => score + 1)
      }
      setChoosenAnwserKey(null)
      setCurrentIndex((index) => index + 1)
    }
  }

  React.useEffect(() => {
    setCurrentQuestion(questions[currentIndex])
  }, [currentIndex])

  const submitQuiz = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    console.log("User", data?.payload?.name, " fick", score, " poäng")

    // score <= passingScore så blir det godkänt.
    // Gör en post till quizresults collection
    // quizResults collectionen ska användas i dashboarden för att hämta
    // alla quiz resultat som en användare har. Samt för att föra
    // statisitk mot andra annvändare, t ex bättre än 70% av alla som tagit det
    // skicka med user_id och score.

    // Lägg även till quiz._id i userObjectet under "completedQuizzes".
  }

  return (
    <>
      <form onSubmit={submitQuiz}>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            py: 8,
          }}
        >
          <Container maxWidth="lg">
            <Card>
              <Box m={2}>
                <NextLink style={{ textDecoration: "none" }} href="/quizzes" passHref>
                  <Button component="a" startIcon={<FaArrowLeft />}>
                    Back
                  </Button>
                </NextLink>
              </Box>
              <CardHeader subheader={`Question ${currentIndex + 1}/${questions.length}`} title={title} />
              <Divider />
              <CardContent>
                <Question question={currentQuestion} choosenAnwserKey={choosenAnwserKey} handleChange={handleChange} />
                <Box mt={1}>
                  <Button
                    disabled={currentIndex === questions.length - 1 || choosenAnwserKey === null}
                    onClick={() => setNextQuestion()}
                    endIcon={<FaArrowRight />}
                  >
                    Next question
                  </Button>
                </Box>
              </CardContent>

              <Divider />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  p: 2,
                  float: "right",
                }}
              >
                <SubmitButton
                  customStyle={{ margin: 1 }}
                  color="success"
                  fullWidth={false}
                  size={"medium"}
                  text="Submit quiz"
                  isLoading={false}
                  isDisabled={currentIndex !== questions.length - 1 || choosenAnwserKey === null}
                />
              </Box>
            </Card>
          </Container>
        </Box>
      </form>
    </>
  )
}

export default Quiz
