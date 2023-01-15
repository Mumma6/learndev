import { SetStateAction, ChangeEvent } from "react"

export const useOnChange = <T>(event: ChangeEvent<HTMLInputElement>, fn: (value: SetStateAction<T>) => void) => {
  fn((prevState) => ({
    ...prevState,
    [event.target.name]: event.target.value,
  }))
}
