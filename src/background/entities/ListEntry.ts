import type { Anime, ListEntry, Prisma } from '@prisma/client'
import { AuthenticationError } from 'apollo-server-express'
import { list, mutationField, nonNull, objectType } from 'nexus'

function createDateFromFuzzyDate(
  startedAt:
    | ({ readonly __typename?: 'FuzzyDate' | undefined } & Pick<
        import('@/__generated__/globalAnilistTypes').FuzzyDate,
        'year' | 'month' | 'day'
      >)
    | null
    | undefined,
) {
  return (
    startedAt &&
    new Date(startedAt.year || 0, startedAt.month || 0, startedAt.day || 0)
  )
}

function createListEntryUpdate(
  anilistAnimeList: { readonly __typename?: 'MediaList' | undefined } & {
    readonly __typename?: 'MediaList' | undefined
  } & Pick<
      import('@/__generated__/globalAnilistTypes').MediaList,
      'id' | 'status' | 'score' | 'progress'
    > & {
      readonly startedAt?:
        | ({ readonly __typename?: 'FuzzyDate' | undefined } & Pick<
            import('@/__generated__/globalAnilistTypes').FuzzyDate,
            'year' | 'month' | 'day'
          >)
        | null
        | undefined
      readonly completedAt?:
        | ({ readonly __typename?: 'FuzzyDate' | undefined } & Pick<
            import('@/__generated__/globalAnilistTypes').FuzzyDate,
            'year' | 'month' | 'day'
          >)
        | null
        | undefined
      readonly media?:
        | ({ readonly __typename?: 'Media' | undefined } & Pick<
            import('@/__generated__/globalAnilistTypes').Media,
            'id' | 'episodes' | 'siteUrl' | 'synonyms'
          > & {
              readonly title?:
                | ({ readonly __typename?: 'MediaTitle' | undefined } & Pick<
                    import('@/__generated__/globalAnilistTypes').MediaTitle,
                    'userPreferred'
                  >)
                | null
                | undefined
              readonly coverImage?:
                | ({
                    readonly __typename?: 'MediaCoverImage' | undefined
                  } & Pick<
                    import('@/__generated__/globalAnilistTypes').MediaCoverImage,
                    'extraLarge'
                  >)
                | null
                | undefined
            })
        | null
        | undefined
    },
) {
  return {
    completedAt: createDateFromFuzzyDate(anilistAnimeList.completedAt),
    startedAt: createDateFromFuzzyDate(anilistAnimeList.startedAt),
    progress: anilistAnimeList.progress || undefined,
    score: anilistAnimeList.score || undefined,
    // status: status || 'undefined',
    statusEnum: anilistAnimeList.status
      ? {
          connect: {
            value: anilistAnimeList.status,
          },
        }
      : undefined,
  }
}

function createAnimeUpdate(
  media: { readonly __typename?: 'Media' | undefined } & Pick<
    import('@/__generated__/globalAnilistTypes').Media,
    'id' | 'episodes' | 'siteUrl' | 'synonyms'
  > & {
      readonly title?:
        | ({ readonly __typename?: 'MediaTitle' | undefined } & Pick<
            import('@/__generated__/globalAnilistTypes').MediaTitle,
            'userPreferred'
          >)
        | null
        | undefined
      readonly coverImage?:
        | ({ readonly __typename?: 'MediaCoverImage' | undefined } & Pick<
            import('@/__generated__/globalAnilistTypes').MediaCoverImage,
            'extraLarge'
          >)
        | null
        | undefined
    },
) {
  return {
    anilistUrl: media.siteUrl,
    coverImage: media.coverImage && media.coverImage.extraLarge,
    episodes: media.episodes,
  }
}

const ListEntryType = objectType({
  name: 'ListEntry',
  definition(t) {
    t.model.id()
    t.model.anime()
    t.model.completedAt()
    t.model.progress()
    t.model.score()
    t.model.startedAt()
    t.model.status()
  },
})

const ListEntryMutation = mutationField((t) => {
  t.field('refreshUserListEntries', {
    type: nonNull(list(nonNull('ListEntry'))),

    async resolve(_, __, { prisma, userId, dataSources }) {
      if (typeof userId !== 'number') {
        throw new AuthenticationError('must authenticate')
      }

      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
        rejectOnNotFound: true,
        include: {
          accounts: true,
        },
      })

      const animeOperations: Prisma.Prisma__AnimeClient<Anime>[] = []
      const operations: Prisma.Prisma__ListEntryClient<ListEntry>[] = []

      for (const account of user.accounts) {
        if (account.service === 'ANILIST') {
          const anilistAPI = await dataSources.anilistAPI.withToken(
            account.token,
          )

          for await (const anilistAnimeList of anilistAPI.fetchUserAnimeList(
            account.accountUserId,
          )) {
            if (
              !(
                anilistAnimeList &&
                anilistAnimeList.media &&
                anilistAnimeList.media.title &&
                anilistAnimeList.media.title.userPreferred
              )
            ) {
              continue
            }

            const animeByService = {
              serviceId: anilistAnimeList.media.id,
              service: 'ANILIST',
            }

            const animeUpdate = {
              ...createAnimeUpdate(anilistAnimeList.media),
              title: anilistAnimeList.media.title.userPreferred,
            }

            animeOperations.push(
              prisma.anime.upsert({
                create: {
                  ...animeByService,
                  ...animeUpdate,
                },
                update: animeUpdate,
                where: {
                  animeByService,
                },
              }),
            )

            const listEntryUpdate = createListEntryUpdate(anilistAnimeList)

            operations.push(
              prisma.listEntry.upsert({
                create: {
                  ...listEntryUpdate,
                  account: {
                    connect: {
                      id: account.id,
                    },
                  },
                  anime: {
                    connect: {
                      animeByService,
                    },
                  },
                  serviceEnum: {
                    connect: {
                      value: 'ANILIST',
                    },
                  },
                  user: {
                    connect: {
                      id: userId,
                    },
                  },
                },
                update: listEntryUpdate,
                where: {
                  userListEntryByAnimeAndService: {
                    ...animeByService,
                    accountId: account.id,
                    userId,
                  },
                },
              }),
            )
          }
        }
      }

      await prisma.$transaction(animeOperations)
      const animeList = await prisma.$transaction(operations)

      prisma.listEntry
        .count({
          where: {
            userId,
          },
        })
        .then((n) => console.log('length: ', n))

      return animeList

      //   for (const anime of animeList) {
      //   }
    },
  })
})

export default [ListEntryType, ListEntryMutation]
