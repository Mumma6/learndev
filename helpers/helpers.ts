import { flow } from "fp-ts/function"
import * as A from "fp-ts/Array"
import * as O from "fp-ts/Option"

export const tap = (val: any) => {
  console.log(val)
  return val
}

export const getOArraySize = flow(
  O.map(A.size),
  O.getOrElse(() => 0)
)
