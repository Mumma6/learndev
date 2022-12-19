import { IUser } from "./user"

declare module "next" {
  interface NextApiRequest {
    logIn: Function
    user?: IUser
    session?: any
    status: Function
    file: {
      path: string
    }
  }
}

declare global {
  namespace Express {
    interface User extends IUser {}
  }
}
