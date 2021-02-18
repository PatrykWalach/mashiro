import { CamelCase } from './camelCase'
import { gql } from '@urql/vue'
import { anilistExecutor } from './schemas/anilist'

import { AnitomyResult } from 'anitomy-js'
import DataLoader from 'dataloader'
import { parse } from 'anitomy-js'




const GET_MEDIA_ID = gql`
  query UtilGetMediaId($search: String!) {
    anilistMedia(search: $search, sort: SEARCH_MATCH, type: ANIME) {
      id
    }
  }
`

// import {
//   UtilGetMediaIdQuery,
//   UtilGetMediaIdQueryVariables,
// } from './__generated__/loaders'

const getMediaId = async (title: string | undefined) => {
  if (title === undefined) {
    return null
  }

  const { data = null } = await anilistExecutor//<

    // UtilGetMediaIdQuery,
    // UtilGetMediaIdQueryVariables
  //>
  ({
    variables: { search: title },
    document: GET_MEDIA_ID,context:{}
  })

  return data && data.anilistMedia && data.anilistMedia.id
}

export const mediaIdLoader = new DataLoader(
  (titles: readonly (string | undefined)[]) =>
    Promise.all(titles.map(getMediaId)),
)

const lowerToCamelCase = <S extends string>(str: S): CamelCase<S> =>
  str.replace(/_+([a-z])/g, (_, l) => l.toUpperCase()) as CamelCase<S>

const normalizeAnitomyResult = (result: AnitomyResult): AnitomyResultModel =>
  Object.fromEntries(
    Object.entries(result).map(
      ([key, value]) => [lowerToCamelCase(key), value] as const,
    ),
  ) as AnitomyResultModel


export type AnitomyResultModel = {
  [K in keyof AnitomyResult as CamelCase<K>
  ]: AnitomyResult[K]
}

export const anitomyLoader = new DataLoader(
  async ([...titles]: readonly string[]) => {
    const results = await parse(titles)
    return results.map(normalizeAnitomyResult)
  },
)
