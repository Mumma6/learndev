import { useState, useEffect, useCallback } from "react"
import { z } from "zod"

/*
create a is disable fn
*/

export type ErrorsType<T> = { [key in keyof T]: string | undefined }
export type TouchedType<T> = { [key in keyof T]: boolean }

const cloneWithDefaultValues = <T extends object>(input: T, newVal: any) =>
  Object.fromEntries(Object.keys(input).map((key) => [key, newVal])) as Record<keyof T, any>

export const useZodFormValidation = <FValues extends object>(schema: z.Schema, formData: FValues) => {
  const generateErrorObject = (arr: z.ZodIssue[]) =>
    Object.fromEntries(arr.map((item) => [item.path[0], item.message])) as ErrorsType<FValues>

  const [values, setValues] = useState<FValues>(formData)
  const [errors, setErrors] = useState<ErrorsType<FValues>>(cloneWithDefaultValues(formData, undefined))
  const [touched, setTouched] = useState<TouchedType<FValues>>(cloneWithDefaultValues(formData, false))

  const validateValues = useCallback(
    (input: FValues) => {
      const parse = schema.safeParse(input)

      setErrors(parse.success ? cloneWithDefaultValues(formData, undefined) : generateErrorObject(parse.error.issues))
    },
    [formData, schema]
  )

  useEffect(() => {
    validateValues(values)
  }, [values, validateValues])

  const setFieldValue = useCallback((key: keyof FValues, value: unknown) => {
    setValues((prevState) => ({ ...prevState, [key]: value }))
  }, [])

  const onBlur = useCallback((key: keyof FValues) => {
    setTouched((prevState) => ({ ...prevState, [key]: true }))
  }, [])

  const reset = useCallback(() => {
    setTouched(cloneWithDefaultValues(formData, false))
  }, [])

  const isDisabled = useCallback((validator?: () => boolean) => {
    const formErrors = Object.values(errors).some((error) => error)

    return validator ? validator() && formErrors : formErrors
  }, [])

  return {
    values,
    setValues,
    errors,
    setFieldValue,
    onBlur,
    touched,
    reset,
    isDisabled,
  }
}

/*
Certainly! Here's an updated version of the useZodFormValidation hook with added validation of touched fields:

typescript
Copy code
import { useState, useEffect, useCallback } from "react"
import { z } from "zod"

export type ErrorsType<T> = { [key in keyof T]: string | undefined }
export type TouchedType<T> = { [key in keyof T]: boolean }

const cloneWithDefaultValues = <T extends object>(input: T, newVal: any) =>
  Object.fromEntries(Object.keys(input).map((key) => [key, newVal])) as Record<keyof T, any>

export const useZodFormValidation = <FValues extends object>(schema: z.Schema, formData: FValues) => {
  const generateErrorObject = (arr: z.ZodIssue[]) =>
    Object.fromEntries(arr.map((item) => [item.path[0], item.message])) as ErrorsType<FValues>

  const [values, setValues] = useState<FValues>(formData)
  const [errors, setErrors] = useState<ErrorsType<FValues>>(cloneWithDefaultValues(formData, undefined))
  const [touched, setTouched] = useState<TouchedType<FValues>>(cloneWithDefaultValues(formData, false))

  const validateValues = useCallback(
    (input: FValues) => {
      const parse = schema.safeParse(input)
      const newErrors = parse.success ? cloneWithDefaultValues(formData, undefined) : generateErrorObject(parse.error.issues)
      setErrors(newErrors)
      return newErrors
    },
    [formData, schema]
  )

  const validateTouched = useCallback(
    () => {
      const touchedErrors = Object.keys(touched).reduce((acc: ErrorsType<FValues>, key: keyof FValues) => {
        if (touched[key]) {
          const parse = schema.pick({ [key]: (schema as any)._def.props[key] }).safeParse({ [key]: values[key] })
          if (!parse.success) {
            acc[key] = parse.error.issues[0].message
          }
        }
        return acc
      }, cloneWithDefaultValues(formData, undefined))
      setErrors((prevErrors) => ({ ...prevErrors, ...touchedErrors }))
      return touchedErrors
    },
    [formData, schema, touched, values]
  )

  useEffect(() => {
    validateValues(values)
  }, [values, validateValues])

  useEffect(() => {
    validateTouched()
  }, [validateTouched])

  const setFieldValue = useCallback((key: keyof FValues, value: unknown) => {
    setValues((prevState) => ({ ...prevState, [key]: value }))
  }, [])

  const onBlur = useCallback((key: keyof FValues) => {
    setTouched((prevState) => ({ ...prevState, [key]: true }))
  }, [])

  const reset = useCallback(() => {
    setValues(formData)
    setTouched(cloneWithDefaultValues(formData, false))
  }, [formData])

  return {
    values,
    setValues,
    errors,
    setFieldValue,
    onBlur,
    touched,
    reset,
  }
}
The main changes include:

A new validateTouched function that validates the fields that have been touched.
An additional useEffect that calls validateTouched every time touched or values change.
A change to the validateValues function to return the new errors object, so it can be used by validateTouched.
A change to the reset function to reset both values and touched to their initial state
*/
