import { ObjectId } from "mongodb"
import { Skill } from "../constants/skillsData"

// allt som har med profieln att göra kan flyttas till en egen db collection.
// Görs vid ett senare tillfälle

export interface Workexperience {
  _id?: ObjectId
  role: string
  startDate: string | null
  endDate: string | null
  description: string
  company: string
  currentJob: boolean
}

export interface IUser {
  emailVerified: boolean
  profilePicture: any
  email: string
  name: string
  bio: any
  skills: Skill[] // profile
  workexperience: Workexperience[] // profil
  // completedQuizzes: any // profile
  _id?: any
}
