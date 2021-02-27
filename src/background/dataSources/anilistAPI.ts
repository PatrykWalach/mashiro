import {
  cacheExchange,
  Client,
  ClientOptions,
  createClient,
  dedupExchange,
  fetchExchange,
  gql,
  TypedDocumentNode,
} from '@urql/vue'

import fetch from 'cross-fetch'

function addAuthToken(token: string) {
  return () => ({
    headers: {
      authorization: token,
    },
  })
}

export const FETCH_LIST_LISTS_ENTRIES = gql`
  fragment AnilistFetchAnimeList_lists_entries on MediaList {
    id
    status
    score
    progress
    startedAt {
      year
      month
      day
    }
    completedAt {
      year
      month
      day
    }
    media {
      id
      episodes
      title {
        userPreferred
      }
      coverImage {
        extraLarge
      }
      siteUrl
      synonyms
    }
  }
`

export const FETCH_LIST_LISTS = gql`
  fragment AnilistFetchAnimeList_lists on MediaListGroup {
    entries {
      ...AnilistFetchAnimeList_lists_entries
    }
  }
  ${FETCH_LIST_LISTS_ENTRIES}
`

export const ANIME_LIST_REFRESH_LIST_QUERY = gql`
  query AnilistFetchAnimeList($chunk: Int!, $userId: Int!) {
    MediaListCollection(
      perChunk: 500
      chunk: $chunk
      userId: $userId
      type: ANIME
      forceSingleCompletedList: true
    ) {
      lists {
        ...AnilistFetchAnimeList_lists
      }
      hasNextChunk
    }
  }
  ${FETCH_LIST_LISTS}
`

// export const ANILIST_FETCH_USER_ID = gql`
//   query AnilistFetchUserId {
//     Viewer {
//       id
//     }
//   }
// `

import {
  AnilistFetchAnimeListDocument,
  // AnilistFetchUserIdDocument,
} from '@/__generated__/globalAnilistTypes'

import DataLoader from 'dataloader'
import { DataSource } from 'apollo-datasource'
import { Context } from '../context'
import { retryExchange } from '@urql/exchange-retry'
// import { AuthenticationError } from 'apollo-server-express'

export class AnilistAPI extends DataSource<Context> {
  private urql: Client

  constructor(options?: Partial<ClientOptions> | undefined) {
    super()

    this.urql = createClient({
      url: process.env.VUE_APP_ANILIST_API_URL || 'https://graphql.anilist.co',
      suspense: true,
      fetch,
      //if reached 80 req wait 1 minute to reset rate limit
      exchanges: [
        dedupExchange,
        cacheExchange,
        retryExchange({
          initialDelayMs: 10 * 1000,
          maxDelayMs: 65 * 1000,
          maxNumberAttempts: 16,
          randomDelay: false,
        }),
        fetchExchange,
      ],
      ...options,
    })
  }

  // async fetchUserId() {
  //   const { data } = await this.query({
  //     query: AnilistFetchUserIdDocument,
  //   })

  //   if (!(data && data.Viewer)) {
  //     throw new AuthenticationError('must authenticate')
  //   }

  //   return data.Viewer.id
  // }

  private async query<Q, V extends object>(options: {
    query: TypedDocumentNode<Q, V>
    variables?: V
  }) {
    return this.urql.query(options.query, options.variables).toPromise()
  }

  private static withTokenDataLoader = new DataLoader(
    async (tokens: readonly string[]) =>
      tokens.map(
        (token) =>
          new AnilistAPI({
            fetchOptions: addAuthToken(token),
          }),
      ),
  )

  withToken(token: string) {
    return AnilistAPI.withTokenDataLoader.load(token)
  }

  async *fetchUserAnimeList(userId: number) {
    let chunk = 1

    while (true) {
      const { data } = await this.query({
        query: AnilistFetchAnimeListDocument,
        variables: {
          chunk: chunk++,
          userId: userId,
        },
      })

      if (!(data && data.MediaListCollection)) {
        return
      }

      for (const list of data.MediaListCollection.lists || []) {
        for (const entry of (list && list.entries) || []) {
          yield entry
        }
      }

      if (!data.MediaListCollection.hasNextChunk) {
        return
      }
    }
  }
}
