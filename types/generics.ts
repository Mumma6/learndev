import { Dispatch, SetStateAction, MouseEvent } from "react"
import { KeyedMutator } from "swr"
import { Response } from "./response"

// When passing a setter function as props
export type SetState<T> = Dispatch<SetStateAction<T>>

// Standard onClick
export type ClickEvent = MouseEvent<HTMLButtonElement>

// When passing a onSubmit or onClick as props that returns a val
export type ClickEventRet<T> = (e: ClickEvent) => T

// When passing a mutate function as props
export type Mutate<T> = KeyedMutator<Response<T>>
