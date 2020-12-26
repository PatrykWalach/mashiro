import { PrismaClient } from '@prisma/client'
import { PrismaClientOptions } from '@prisma/client/runtime'

const isNumber = (value: unknown): value is number => !Number.isNaN(value)

export const getMediaById = (
  prisma: PrismaClient<PrismaClientOptions, never>,
  id: number | undefined | null,
) =>
  isNumber(id)
    ? prisma.media.findFirst({
        where: { id },
      })
    : null

import { objectType, extendType, queryField } from 'nexus'

const MediaType = objectType({
  name: 'Media',
  definition(t) {
    t.model.id()
    // t.model.episodeOffset()
    t.int('episodeOffset')
  },
})

const ExtendFile = extendType({
  type: 'File',
  definition(t) {
    t.field('media', {
      type: MediaType,
      resolve: ({ mediaId }, _, { prisma }) => getMediaById(prisma, mediaId),
    })
  },
})

// const ExtendItem = extendType({
//   type: 'FeedItem',
//   definition(t) {
//     t.field('media', {
//       type: MediaType,
//       resolve: ({ mediaId }, _, { prisma }) => getMediaById(prisma, mediaId),
//     })
//   },
// })

const ExtendActivity = extendType({
  type: 'Activity',
  definition(t) {
    t.field('media', {
      type: MediaType,
      resolve: ({ mediaId }, _, { prisma }) => getMediaById(prisma, mediaId),
    })
  },
})

const MediaQuery = queryField(t =>
  t.crud.media({
    filtering: { id: true },
    pagination: false,
  }),
)

export const Media = {
  MediaType,
  ExtendFile,
  // ExtendItem,
  ExtendActivity,
  MediaQuery,
}
