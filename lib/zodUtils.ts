import { AnyZodObject, z, ZodObject, ZodType } from "zod"
import { Response } from "../types/response"
import { handleAPIError } from "./utils"

/*

type Implements<Model> = {
  [key in keyof Model]-?: undefined extends Model[key]
    ? null extends Model[key]
      ? z.ZodNullableType<z.ZodOptionalType<z.ZodType<Model[key]>>>
      : z.ZodOptionalType<z.ZodType<Model[key]>>
    : null extends Model[key]
    ? z.ZodNullableType<z.ZodType<Model[key]>>
    : z.ZodType<Model[key]>
}

export function implementZod<Model = never>() {
  return {
    with: <
      Schema extends Implements<Model> & {
        [unknownKey in Exclude<keyof Schema, keyof Model>]: never
      }
    >(
      schema: Schema
    ) => z.object(schema),
  }
}

export const schemaForType = <Type, Schema = z.ZodType<Type, any, any>>(schema: Schema) => {
  return schema
}

*/

interface ValidateResponse<Body> {
  data: Body | null
  error: Boolean
}

export const validateBody = <Output>(schema: AnyZodObject, data: Output): ValidateResponse<Output> => {
  const result = schema.safeParse(data)

  // return better error handeling
  if (!result.success) {
    return {
      data: null,
      error: true,
    }
  }

  return {
    data,
    error: false,
  }
}
