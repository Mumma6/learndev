import React from "react"
import { IQuestion, IQuiz } from "../../models/Quiz"
import { Box, Paper, Card, CardContent, CardHeader, Divider, Container, Button } from "@mui/material"
import SubmitButton from "../shared/SubmitButton"
import { FaArrowLeft, FaArrowRight } from "react-icons/fa"
import NextLink from "next/link"
import Question from "./Question"
import { useCurrentUser } from "../../lib/hooks"
import { fetcher } from "../../lib/axiosFetcher"
import { toast } from "react-toastify"
import { UserModelSchemaType } from "../../schema/UserSchema"

interface IProps {
  quiz: IQuiz
}

const Quiz = ({ quiz }: IProps) => {
  const { data } = useCurrentUser()
  const { title, questions, passingScore, difficulty, mainTopic } = quiz

  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [currentQuestion, setCurrentQuestion] = React.useState<IQuestion>(questions[currentIndex])
  const [isLoading, setIsLoading] = React.useState(false)
  const [quizCompleted, setQuizCompleted] = React.useState(false)
  const [quizCompletedMessage, setQuizCompletedMessage] = React.useState("")

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

  const submitQuiz = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const quizResultResponse = await fetcher("/api/quizresults", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      data: {
        quiz_id: quiz._id,
        user_id: data?.payload?._id,
        score,
        approved: score >= passingScore,
        difficulty,
        maxScore: questions.length,
        topic: mainTopic,
        title,
      },
    })

    const userResponse = await fetcher<UserModelSchemaType, Pick<UserModelSchemaType, "completedQuizzes">>("/api/user", {
      headers: { "Content-Type": "application/json" },
      method: "PATCH",
      data: {
        completedQuizzes: [...(data?.payload?.completedQuizzes || []), quiz._id.toString()],
      },
    })

    if (quizResultResponse.error) {
      toast.error(quizResultResponse.error)
      setIsLoading(false)
    } else if (userResponse.error) {
      toast.error(quizResultResponse.error)
      setIsLoading(false)
    } else {
      setIsLoading(false)
      toast.success("Quiz completed")
      setQuizCompleted(true)
      setQuizCompletedMessage(
        score >= passingScore
          ? "You have passed the quiz. Congratulations!"
          : "Sorry you did not pass the score for this quiz. You can try again in 30 days"
      )
    }
  }

  const CompletedCard = () => (
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
              <Button disabled={isLoading} component="a" startIcon={<FaArrowLeft />}>
                Back
              </Button>
            </NextLink>
          </Box>
          <CardHeader subheader={"Quiz completed"} title={title} />
          <Divider />
          <CardContent>{quizCompletedMessage}</CardContent>
          <Divider />
        </Card>
      </Container>
    </Box>
  )

  const InProgressCard = () => (
    <form onSubmit={submitQuiz}>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Card sx={{ marginTop: 4 }}>
            <Box m={2}>
              <NextLink style={{ textDecoration: "none" }} href="/quizzes" passHref>
                <Button disabled={isLoading} component="a" startIcon={<FaArrowLeft />}>
                  Back
                </Button>
              </NextLink>
            </Box>
            <CardHeader subheader={`Question ${currentIndex + 1}/${questions.length}`} title={title} />
            <Divider />
            <CardContent>
              <Question question={currentQuestion} choosenAnwserKey={choosenAnwserKey} handleChange={handleChange} />
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
              {" "}
              {currentIndex === questions.length - 1 ? (
                <SubmitButton
                  customStyle={{ margin: 1 }}
                  color="success"
                  fullWidth={false}
                  size={"medium"}
                  text="Submit quiz"
                  isLoading={false}
                  isDisabled={currentIndex !== questions.length - 1 || choosenAnwserKey === null || isLoading}
                />
              ) : (
                <Button
                  disabled={currentIndex === questions.length - 1 || choosenAnwserKey === null}
                  onClick={() => setNextQuestion()}
                  endIcon={<FaArrowRight />}
                >
                  Next question
                </Button>
              )}
            </Box>
          </Card>
        </Container>
      </Box>
    </form>
  )

  return quizCompleted ? <CompletedCard /> : <InProgressCard />
}

export default Quiz
