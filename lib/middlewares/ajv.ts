import Ajv from "ajv"

/*
FIX TYPES
*/

export function validateBody(schema: any) {
  const ajv = new Ajv()
  const validate = ajv.compile(schema)
  return (req: any, res: any, next: any) => {
    const valid = validate(req.body)
    if (valid) {
      console.log("valid")
      return next()
    } else {
      console.log("notvalid")
      // @ts-ignore

      const error = validate.errors[0]
      return res.status(400).json({
        error: {
          message: `"${error.instancePath.substring(1)}" ${error.message}`,
        },
      })
    }
  }
}
