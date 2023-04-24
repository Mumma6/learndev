import { flow, pipe } from "fp-ts/function"
import * as A from "fp-ts/Array"
import * as O from "fp-ts/Option"
import * as R from "fp-ts/lib/Record"
import * as S from "fp-ts/lib/string"
import { ResourceEnum, ResourceTypeEnum } from "../schema/ResourceSchema"

const typeColors = [
  "#14b8a6",
  "#7c4dff",
  "#3F51B5",
  "#e53935",
  "#FF9800",
  "#9c27b0",
  "#673AB7",
  "#795548",
  "#8bc34a",
  "#00bcd4",
  "#a12828",
  "#807d7d",
]

export const tap = (val: any) => {
  console.log(val)
  return val
}

export const getOArraySize = flow(
  O.map(A.size),
  O.getOrElse(() => 0)
)

// come up with someting better then this nonsense...
export const getResourceTypeColor = (type: ResourceEnum): string => {
  switch (type) {
    case "Book":
      return typeColors[0]
    case "Tutorial":
      return typeColors[1]
    case "Blog":
      return typeColors[2]
    case "Documentation":
      return typeColors[3]
    case "Podcast":
      return typeColors[4]
    case "Article":
      return typeColors[5]
    case "Code repository":
      return typeColors[6]
    case "Forum":
      return typeColors[7]
    case "Cheat sheet":
      return typeColors[8]
    case "Video clip":
      return typeColors[9]
    case "Website":
      return typeColors[10]
    case "Other":
      return typeColors[11]
    default:
      return "#000000" // default color for unknown types
  }
}
