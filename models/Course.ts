import { Institution } from "../components/courses/Courses"

export interface ICourse {
  content: {
    title: string
    description: string
    institution: keyof typeof Institution
    url: string
  }
  userId: string
  createdAt?: string | Date
  _id?: string
}
