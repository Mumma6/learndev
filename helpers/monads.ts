/**
 * These functions should not be use. Instead use Option and Either/TaskEither from fp-ts
 */

interface Left<E> {
  _tag: "Left"
  left: E
}

interface Right<A> {
  _tag: "Right"
  right: A
}

interface None {
  _tag: "None"
}

interface Some<T> {
  _tag: "Some"
  value: T
}

export type Option<T> = None | Some<T>

export type Either<E, A> = Left<E> | Right<A>

const some = <A>(x: A): Option<A> => ({
  _tag: "Some",
  value: x,
})

const none: Option<never> = {
  _tag: "None",
}

export const left = <E, A = never>(error: E): Either<E, A> => ({
  _tag: "Left",
  left: error,
})

export const right = <A, E = never>(data: A): Either<E, A> => ({
  _tag: "Right",
  right: data,
})

export const eMap = <E, A, B>(either: Either<E, A>, f: (a: A) => B): Either<E, B> =>
  either._tag === "Right" ? right(f(either.right)) : either

export const eChain = <E, A, B>(either: Either<E, A>, f: (a: A) => Either<E, B>): Either<E, B> =>
  either._tag === "Right" ? f(either.right) : either

export const eFold = <E, A, B>(either: Either<E, A>, leftFn: (e: E) => B, rightFn: (a: A) => B): B =>
  either._tag === "Right" ? rightFn(either.right) : leftFn(either.left)
