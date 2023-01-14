import { ObjectId } from "mongodb"
import { Skill } from "../constants/skillsData"

// allt som har med profieln att göra kan flyttas till en egen db collection.
// Görs vid ett senare tillfälle

// Flytta detta till models mappen.

export interface ISocials {
  linkedin: string
  twitter: string
  youtube: string
  github: string
  personalWebsite: string
  blog: string
}

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
  password: string
  profilePicture: any
  email: string
  name: string
  bio: any
  skills: Skill[]
  workexperience: Workexperience[]
  completedQuizzes: string[]
  socials: ISocials
  userSettings: Object
  _id?: any
}
