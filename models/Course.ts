import { ObjectId } from "mongodb"
import { Institution } from "../components/courses/Courses"

export interface IResources {
  title: string
  link: string // url, github repo osv osv.
}

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
  topics?: string[] // vad har man lärt sig av kursen. t ex "javascript", "react" Plocka saker från Constant objectet? Välja flera "kompetenser" kopplat till varje kurs.
  tags?: string[] // used for searching/matching. Skapas när man sparar. Key words som title och topics hamnar här. Även detta som man kan söka på sen.
  completed?: boolean
  learningResources?: IResources[]
  duration?: string // Hur lång den är. t ex 3h eller 20h
  feedback?: string
}
