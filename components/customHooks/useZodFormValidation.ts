import { SetStateAction, ChangeEvent, useState, useEffect } from "react"
import { z, ZodError } from "zod"

/*
add methods similar to formik

touched,
dirty
osv

Ska inte visa felet förens man har blurat

 // onBlur={formik.handleBlur}
  helperText={(formik.touched.github && formik.errors.github) || " "}

  onBlur={() => setTouched(true)}

  onblur sätter touched. Då kan man komma valideringen

  https://codesandbox.io/embed/9l9p6mkvpo

  därför som helper tecten kollar både touched och errors.

*/

export type ZodValidateFormErrors = { [key: string]: string | undefined }

export const useZodFormValidation = <FValues>(schema: z.Schema, formData: FValues) => {
  const genereateErrorObject = (arr: z.ZodIssue[]) => {
    const output = arr.reduce((acc, item) => {
      acc[item.path[0]] = item.message
      return acc
    }, {} as { [key: string]: string })

    return output as any
  }

  const genereateEmptyErrorObject = (values: FValues) => {
    const newObj = {} as any
    for (const key in values) {
      newObj[key] = undefined
    }
    return newObj as { [key in keyof FValues]: undefined }
  }

  const [values, setValues] = useState<FValues>(formData)
  const [errors, setErrors] = useState(genereateEmptyErrorObject(formData))
  const [touched, setTouched] = useState(false)

  useEffect(() => {
    const parse = schema.safeParse(values)

    console.log(parse)

    if (!parse.success) {
      setErrors(genereateErrorObject(parse.error.issues))
    }
  }, [values])

  const setFieldValue = (key: keyof FValues, value: unknown) => {
    setValues((prevState) => ({
      ...prevState,
      [key]: value,
    }))
  }

  return {
    values,
    setValues,
    errors,
    setFieldValue,
  }
}
