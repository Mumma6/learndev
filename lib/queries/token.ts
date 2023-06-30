import { type Db, type ObjectId } from "mongodb"
import { nanoid } from "nanoid"

export async function findTokenByIdAndType (db: Db, id: string, type: any) {
  return await db.collection("tokens").findOne({
    securedTokenId: id,
    type
  })
}

export async function findAndDeleteTokenByIdAndType (db: Db, id: string, type: any) {
  const { value } = await db.collection("tokens").findOneAndDelete({ securedTokenId: id, type })
  return value
}

export async function createToken (
  db: Db,
  { creatorId, type, expireAt }: { creatorId: ObjectId, type: string, expireAt: Date }
) {
  const securedTokenId = nanoid(24)
  const token = {
    securedTokenId,
    creatorId,
    type,
    expireAt
  }
  await db.collection("tokens").insertOne(token)
  return token
}
