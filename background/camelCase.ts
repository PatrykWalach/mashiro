type Delimiter = '_'

type Letter =
  | 'a'
  | 'b'
  | 'c'
  | 'd'
  | 'e'
  | 'f'
  | 'g'
  | 'h'
  | 'i'
  | 'j'
  | 'k'
  | 'l'
  | 'm'
  | 'n'
  | 'o'
  | 'p'
  | 'q'
  | 'r'
  | 's'
  | 't'
  | 'u'
  | 'v'
  | 'w'
  | 'x'
  | 'y'
  | 'z'
type CapitalizeFirst<S extends string> = S extends `${infer H}${infer R}`
  ? `${Capitalize<H>}${R}`
  : Capitalize<S>

export type CamelCase<S> = S extends `${infer Head}${Delimiter}${infer Tail}`
  ? Tail extends `${Delimiter}${infer tmp}`
    ? `${Head}${Delimiter}${CamelCase<Tail>}`
    : Tail extends `${Letter}${infer tmp}`
    ? `${Head}${CamelCase<CapitalizeFirst<Tail>>}`
    : `${Head}${Delimiter}${CamelCase<Tail>}`
  : S
