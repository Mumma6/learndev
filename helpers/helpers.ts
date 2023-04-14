import { flow, pipe } from "fp-ts/function"
import * as A from "fp-ts/Array"
import * as NEA from "fp-ts/NonEmptyArray"
import * as O from "fp-ts/Option"
import * as Record from "fp-ts/Record"
import { CourseModelSchemaType, StatusEnumType } from "../schema/CourseSchema"
import { colors } from "../constants/colors"
import { ProjectModelType, ProjectStatusEnumType } from "../schema/ProjectSchema"
import * as E from "fp-ts/Either"
import * as R from "fp-ts/Record"
import * as semigroup from "fp-ts/Semigroup"

export const tap = <T>(val: T): T => {
  console.log(val)
  return val
}

export const getOArraySize = flow(
  O.map(A.size),
  O.getOrElse(() => 0)
)
