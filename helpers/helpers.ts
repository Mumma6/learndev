interface Pipeline {
  <A, B>(fn1: (input: A) => B): (value: A) => B
  <A, B, C>(fn1: (input: A) => B, fn2: (input: B) => C): (value: A) => C
  <A, B, C, D>(fn1: (input: A) => B, fn2: (input: B) => C, fn3: (input: C) => D): (value: A) => D
  <A, B, C, D, E>(fn1: (input: A) => B, fn2: (input: B) => C, fn3: (input: C) => D, fn4: (input: D) => E): (value: A) => E
  <A, B, C, D, E, F>(
    fn1: (input: A) => B,
    fn2: (input: B) => C,
    fn3: (input: C) => D,
    fn4: (input: D) => E,
    fn5: (input: E) => F
  ): (value: A) => F
}

export const pipeline: Pipeline =
  (...fns: Function[]) =>
  (value: unknown): unknown =>
    fns.reduce((acc, fn) => fn(acc), value)
