import React, { useState, useEffect } from "react"
import Paper from "@mui/material/Paper"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import { Avatar, Box, Button, Card, CardContent, CardHeader, Divider, Container, Typography } from "@mui/material"
import { FaArrowLeft, FaArrowRight, FaCheck } from "react-icons/fa"
import SubmitButton from "../shared/SubmitButton"
import OnBoardingStep from "./OnBoardingStep"

import { toast } from "react-toastify"
import { pipe } from "fp-ts/function"
import * as TE from "fp-ts/TaskEither"
import { fetcherTE } from "../../lib/axiosFetcher"
import { UserModelSchemaType } from "../../schema/UserSchema"
import { useSWRConfig } from "swr"

interface IProps {
  showOnboarding: boolean
}

export interface ISteps {
  title: string
  description: string
  image: string | undefined
}

const STEPS: ISteps[] = [
  {
    title: "Welcome to Studify!",
    description:
      "An all-in-one platform for self-taught developers. Let's get started with a quick tour to get you famailiar with the app!",
    image: undefined,
  },
  {
    title: "Manage Your Schedule",
    description:
      "Use our powerful calendar tool to organize your study schedule, plan your learning sessions, and set project deadlines.",
    image: "/assets/images/onb-calendar.jpg",
  },
  {
    title: "Take Control of Your Courses",
    description:
      "Easily plan and track your progress with our course management system. Manage all your resources and activities in one place.",
    image: "/assets/images/onb-courses.jpg",
  },
  {
    title: "Track Your Progress",
    description:
      "With our intuitive dashboard, you can analyze your progress, visualize your achievements, and make data-driven decisions to improve your skills.",
    image: "/assets/images/onb-dashboard.jpg",
  },
  {
    title: "Manage Your Projects",
    description: "Keep all your code, notes, and project progress in one place, making project management a breeze.",
    image: "/assets/images/onb-project.jpg",
  },
  {
    title: "Test Your Knowledge",
    description:
      "Use Studify's built-in quizzes and assessments to test your skills and knowledge, and identify areas of improvement.",
    image: "/assets/images/onb-quiz.jpg",
  },
  {
    title: "Showcase Your Skills",
    description:
      "Create an impressive profile and share it with potential recruiters. Showcase your learning journey, skills, and projects.",
    image: "/assets/images/onb-share.jpg",
  },
  {
    title: "You're All Set!",
    description: "Now you're ready to dive in and start learning with Studify. Happy coding!",
    image: undefined,
  },
]

export const OnBoardingModal = ({ showOnboarding = false }: IProps) => {
  const [showModal, setShowModal] = useState(showOnboarding)

  const [currentIndex, setCurrentIndex] = useState(0)

  const [currentStep, setCurrentStep] = useState<ISteps>(STEPS[currentIndex])

  const { mutate } = useSWRConfig()

  useEffect(() => {
    setCurrentStep(STEPS[currentIndex])
  }, [currentIndex])

  const onDone = () => {
    pipe(
      fetcherTE<UserModelSchemaType, Pick<UserModelSchemaType, "hasCompletedOnboarding">>("/api/user", {
        headers: { "Content-Type": "application/json" },
        method: "PATCH",
        data: {
          hasCompletedOnboarding: true,
        },
      }),
      TE.fold(
        (error) => {
          toast.error(error)
          return TE.left(error)
        },
        (data) => {
          mutate("/api/user")
          toast.success("Onboarding completed!")
          setShowModal(false)
          return TE.right(data)
        }
      )
    )()
  }

  return (
    <Dialog fullWidth open={showModal}>
      <Container maxWidth="lg">
        <Card>
          <CardHeader subheader="Step by step guide" title="On boarding" />
          <Divider />
          <CardContent
            sx={{
              minHeight: 600,
            }}
          >
            <OnBoardingStep step={currentStep} />
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
            {currentIndex !== 0 && (
              <Button onClick={() => setCurrentIndex((index) => index - 1)} startIcon={<FaArrowLeft />}>
                Previous
              </Button>
            )}
            {currentIndex === STEPS.length - 1 ? (
              <Button onClick={() => onDone()} endIcon={<FaCheck />}>
                Done
              </Button>
            ) : (
              <Button
                disabled={currentIndex === STEPS.length - 1}
                onClick={() => setCurrentIndex((index) => index + 1)}
                endIcon={<FaArrowRight />}
              >
                Next
              </Button>
            )}
          </Box>
        </Card>
      </Container>
    </Dialog>
  )
}
