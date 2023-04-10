interface Left<E> {
  _tag: "Left"
  left: E
}

interface Right<A> {
  _tag: "Right"
  right: A
}

export type Either<E, A> = Left<E> | Right<A>

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
