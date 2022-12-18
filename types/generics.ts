import { Dispatch, SetStateAction, MouseEvent } from "react"

// When passing a setter function as props
export type SetState<T> = Dispatch<SetStateAction<T>>

// Standard onClick
export type ClickEvent = MouseEvent<HTMLButtonElement>

// When passing a onSubmit or onClick as props that returns a val
export type ClickEventRet<T> = (e: ClickEvent) => T
