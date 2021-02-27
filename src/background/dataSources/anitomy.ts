import { DataSource } from 'apollo-datasource'
import DataLoader from 'dataloader'
import { Context } from '../context'

const lowerToCamelCase = <S extends string>(str: S): CamelCase<S> =>
  str.replace(/_+([a-z])/g, (_, l) => l.toUpperCase()) as CamelCase<S>

type CamelCaseKeys<T> = {
  [K in keyof T as CamelCase<K>]: T[K]
}

const objectKeysLowerToCamelCase = <T>(result: T): CamelCaseKeys<T> =>
  Object.fromEntries(
    Object.entries(result).map(
      ([key, value]) => [lowerToCamelCase(key), value] as const,
    ),
  ) as CamelCaseKeys<T>

export type AnitomyResultModel = CamelCaseKeys<AnitomyResult>

import { AnitomyResult, parse } from 'anitomy-js'
import { CamelCase } from '../camelCase'

export class Anitomy extends DataSource<Context> {
  //   constructor() {
  //     super()
  //   }

  private anitomyLoader = new DataLoader(
    async ([...titles]: readonly string[]) => {
      const results = await parse(titles)
      return results.map(objectKeysLowerToCamelCase)
    },
  )

  getAnitomyResult(title: string) {
    return this.anitomyLoader.load(title)
  }

  getAnitomyResults(titles: string[]) {
    return this.anitomyLoader.loadMany(titles)
  }
}
