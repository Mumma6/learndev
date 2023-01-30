import { ObjectId } from "mongodb"
import { Skill } from "../constants/skillsData"

export interface IProjects {
  _id?: string | ObjectId
  userId: string
  title: string
  shortDescription: string // används tsm med title i kortet. Vanliga description kommer när man klickar
  description: string
  createdAt: string | Date
  techStack: Skill[]
  completed: boolean
  learningExperience?: string // Längre beskrivning över vad som lärdes av projektet. Fyller man i när man går till /:id
  sourceCodeUrl?: string // typ github
  deployedUrl?: string // typ www.martinpersson.io
}
