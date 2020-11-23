import { print } from 'graphql'
import fetch from 'cross-fetch'

import {
  linkToExecutor,
  loadSchema,
  UrlLoader,
  SubschemaConfig,
} from 'graphql-tools'

import { ApolloLink, HttpLink } from '@apollo/client'

export const diff = <T>(
  prev: T[],
  next: T[],
  comparator: (a: T, b: T) => number,
) => {
  let i = 0,
    j = 0

  const removed = [],
    added = []

  while (i < prev.length && j < next.length) {
    const cmp = comparator(prev[i], next[j])

    if (cmp < 0) {
      removed.push(prev[i])
      i++
    } else if (cmp > 0) {
      added.push(next[j])
      j++
    } else {
      i++
      j++
    }
  }

  for (; i < prev.length; i++) {
    removed.push(prev[i])
  }

  for (; j < next.length; j++) {
    added.push(next[j])
  }

  return [added, removed] as const
}

export const isString = (t: unknown): t is string =>
  typeof t === 'string' || t instanceof String

export const keyToBoolean = <T>(item: T, key: keyof T) => {
  if (!(key in item)) {
    return null
  }
  const value = item[key]
  if (isString(value)) {
    return value === 'Yes'
  }
  return null
}

export const checkUndefined = <T>(value: T | undefined): T | null =>
  value === undefined ? null : value

export const valuesFromResults = <Id extends string | symbol | number>(
  id: Id,
) => <
  K extends string | symbol | number,
  T extends {
    [J in Id]: K
  }
>(
  media: T[],
  keys: readonly K[],
): (T | null)[] => {
  const mediaIdToIndex: Record<K, number> = Object.fromEntries(
    media.map((result, i) => [[result[id]], i]),
  )

  return keys.map(id => media[mediaIdToIndex[id]] || null)
}

export const createRemoteSchema = async ({
  uri,
  ...settings
}: Omit<SubschemaConfig, 'schema' | 'executor'> & { uri: string }) => ({
  ...settings,
  executor: linkToExecutor(
    ApolloLink.from([
      new ApolloLink((operation, forward) => {
        console.log(print(operation.query))
        console.log(operation.variables)
        return forward(operation)
      }),
      new HttpLink({ uri, fetch }),
    ]),
  ),
  schema: await loadSchema(uri, {
    loaders: [new UrlLoader()],
  }),
})
