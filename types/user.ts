import { Skill } from "../constants/skillsData"

export interface IUser {
  emailVerified: boolean
  profilePicture: any
  email: string
  name: string
  bio: any
  skills: Skill[]
  _id?: any
}
