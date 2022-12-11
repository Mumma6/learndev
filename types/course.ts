import { ObjectId } from "mongodb"

export default interface ICourse {
  title: string
  description: string
  institution: string
  url: string
  _id?: ObjectId
}
