import Ajv from "ajv"

/*
USE THIS INSTEAD

*/

import { NextApiRequest, NextApiResponse } from "next"
import { NextFunction } from "express"

type ValidationError = {
  message: string
  instancePath: string
}

type ValidateBodyOptions = {
  schema: object
}

export function validateBody(options: ValidateBodyOptions) {
  const ajv = new Ajv()
  const validate = ajv.compile(options.schema)
  return (req: NextApiRequest, res: NextApiResponse, next: NextFunction) => {
    const valid = validate(req.body)
    if (valid) {
      next()
    } else {
      const error = ajv.errors![0] || ({ message: "error" } as ValidationError)
      res.status(400).json({
        error: {
          message: `"${error.instancePath.substring(1)}" ${error.message}`,
        },
      })
    }
  }
}

/*
import { NextApiRequest, NextApiResponse } from "next"
import { validateBody } from "./validateBody"

const schema = {
  properties: {
    name: {
      type: "string",
    },
    age: {
      type: "integer",
      minimum: 0,
      maximum: 120,
    },
  },
  required: ["name", "age"],
}

export default (req: NextApiRequest, res: NextApiResponse) => {
  validateBody({ schema })(req, res, () => {
    // The request body is valid.
    // You can access the name and age properties of the request body like this:
    const name = req.body.name
    const age = req.body.age
    // ...
  })
}

*/
