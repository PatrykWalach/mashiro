import { gql, HttpLink } from '@apollo/client'
import { AnitomyResult } from 'anitomy-js'
import DataLoader from 'dataloader'
import { linkToExecutor } from 'graphql-tools'
import { parse } from 'anitomy-js'
import { fetch } from 'cross-fetch'

export const anilistExecutor = linkToExecutor(
  new HttpLink({ uri: 'https://graphql.anilist.co', fetch }),
)

const GET_MEDIA_ID = gql`
  query UtilGetMediaId($search: String!) {
    anilistMedia(search: $search, sort: SEARCH_MATCH, type: ANIME) {
      id
    }
  }
`

import {
  UtilGetMediaIdQuery,
  UtilGetMediaIdQueryVariables,
} from './__generated__/loaders'

const getMediaId = async (title: string | undefined) => {
  if (title === undefined) {
    return null
  }

  const { data = null } = await anilistExecutor<
    UtilGetMediaIdQuery,
    UtilGetMediaIdQueryVariables
  >({
    variables: { search: title },
    document: GET_MEDIA_ID,
  })

  return data && data.anilistMedia && data.anilistMedia.id
}

export const mediaIdLoader = new DataLoader(
  (titles: readonly (string | undefined)[]) =>
    Promise.all(titles.map(getMediaId)),
)

const normalizeAnitomyResult = ({
  anime_title,
  episode_number,
  video_resolution,
  release_group,
  file_name,
  file_extension,
}: AnitomyResult) => ({
  animeTitle: anime_title,
  episodeNumber: episode_number,
  videoResolution: video_resolution,
  subgroup: release_group,
  fileName: file_name,
  fileExtension: file_extension,
})

export type AnitomyResultModel = ReturnType<typeof normalizeAnitomyResult>

export const anitomyLoader = new DataLoader(
  async ([...titles]: readonly string[]) => {
    const results = await parse(titles)
    return results.map(normalizeAnitomyResult)
  },
)
