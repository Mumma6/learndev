import { Db, ObjectId } from "mongodb"
import { nanoid } from "nanoid"

export function findTokenByIdAndType(db: Db, id: string, type: any) {
  return db.collection("tokens").findOne({
    securedTokenId: id,
    type,
  })
}

export function findAndDeleteTokenByIdAndType(db: Db, id: string, type: any) {
  return db
    .collection("tokens")
    .findOneAndDelete({ securedTokenId: id, type })
    .then(({ value }) => value)
}

export async function createToken(db: Db, { creatorId, type, expireAt }: { creatorId: ObjectId; type: any; expireAt: any }) {
  const securedTokenId = nanoid(24)
  console.log(securedTokenId)
  const token = {
    securedTokenId,
    creatorId,
    type,
    expireAt,
  }
  await db.collection("tokens").insertOne(token)
  return token
}
