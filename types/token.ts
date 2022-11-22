import { ObjectId } from "mongodb"

export interface IToken {
  _id: ObjectId
  securedTokenId: string
  creatorId: ObjectId
  expireAt: Date
}
