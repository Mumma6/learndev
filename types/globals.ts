import { UserModelSchemaType } from "../schema/UserSchema"

declare module "next" {
  interface NextApiRequest {
    logIn: Function
    user?: UserModelSchemaType
    session?: any
    status: Function
    file: {
      path: string
    }
  }
}

declare global {
  namespace Express {
    interface User extends UserModelSchemaType {}
  }
}
