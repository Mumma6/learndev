import { ObjectId } from "mongodb"
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
  _id?: string | ObjectId
  tags?: string[] // vad har man lärt sig av kursen. t ex "javascript", "react" Plocka saker från Constant objectet? Välja flera "kompetenser" kopplat till varje kurs.
  completed?: boolean
}
