import { NextApiRequest, NextApiResponse } from "next"

export default async function logger(req: NextApiRequest, res: NextApiResponse, next: () => void) {
  console.log(`hej`)
  next()
}
