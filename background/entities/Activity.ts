import { Activity as A } from '@prisma/client'
import {
  enumType,
  mutationField,
  nonNull,
  objectType,
  queryField,
  subscriptionField,
} from 'nexus'

const ActivitySubscribe = subscriptionField((t) => {
  t.field('activityUpdated', {
    type: nonNull('Activity'),
    subscribe: (_, __, { pubsub, events }) =>
      pubsub.asyncIterator([events.ACTIVITY_UPDATED]),
    resolve: (e: A) => e,
  })
  t.field('activityAdded', {
    type: nonNull('Activity'),
    subscribe: (_, __, { pubsub, events }) =>
      pubsub.asyncIterator([events.ACTIVITY_ADDED]),
    resolve: (e: A) => e,
  })
})

enum ActivityStatus {
  WATCHING,
  WATCHED,
  UPDATED,
}

const ActivityMutation = mutationField((t) => {
  t.field('finishActivity', {
    type: nonNull('Activity'),
    args: { id: nonNull('Int') },
    async resolve(_, { id }, { prisma, pubsub, events }) {
      const activityUpdated = await prisma.activity.update({
        where: { id },
        data: {
          status: ActivityStatus.WATCHED,
        },
      })

      pubsub.publish(events.ACTIVITY_UPDATED, activityUpdated)
      /*update list with activity*/

      return activityUpdated
    },
  })
  t.field('updateActivityMedia', {
    type: nonNull('Activity'),
    args: { id: nonNull('Int'), mediaId: nonNull('Int') },
    resolve: (_, { id, mediaId }, { prisma }) =>
      prisma.activity.update({
        where: { id },
        data: {
          media: {
            connectOrCreate: {
              where: { id: mediaId },
              create: { id: mediaId },
            },
          },
        },
      }),
  })

  t.field('createActivity', {
    type: nonNull('Activity'),
    args: { fullTitle: nonNull('String'), className: nonNull('String') },
    async resolve(
      _,
      args,
      { pubsub, events, prisma, mediaIdLoader, anitomyLoader },
    ) {
      const anitomyResults = await anitomyLoader.load(args.fullTitle)

      const pastActivity = await prisma.activity.findFirst({
        where: { animeTitle: anitomyResults.animeTitle },
        select: {
          mediaId: true,
        },
      })

      const pastActivityId = pastActivity && pastActivity.mediaId

      const id =
        typeof pastActivityId === 'number'
          ? pastActivityId
          : await mediaIdLoader.load(anitomyResults.animeTitle)

      const activityAdded = await prisma.activity.create({
        data: {
          ...anitomyResults,
          className: args.className,
          media:
            typeof id === 'number'
              ? {
                  connectOrCreate: { where: { id }, create: { id } },
                }
              : undefined,
        },
      })

      pubsub.publish(events.ACTIVITY_ADDED, activityAdded)

      return activityAdded
    },
  })
})

// const ActivityUpdate = objectType({
//   name: 'ActivityUpdate',
//   definition(t) {
//     t.nonNull.int('id')
//     t.nonNull.string('updatedAt')
//     t.nonNull.field('status', { type: 'ActivityStatus' })
//   },
// })

export const ActivityType = objectType({
  name: 'Activity',
  definition(t) {
    t.implements('AnitomyResult')
    // t.implements('ActivityUpdate')
    t.model.id()
    t.model.updatedAt()
    t.nonNull.field('status', { type: 'ActivityStatus' })
    t.model.animeTitle()
    t.model.className()
    t.model.media()
    t.model.episodeNumber()
    t.model.fileExtension()
    t.model.fileName()
    t.model.subgroup()
    t.model.videoResolution()
    t.model.animeTitle()
  },
})

const ActivityQuery = queryField((t) =>
  t.crud.activities({
    ordering: { updatedAt: true, id: true },
    // filtering: { status: true },
  }),
)

export default [
  ActivityType,
  // ActivityUpdate,
  ActivityQuery,
  ActivitySubscribe,
  ActivityMutation,
  enumType({
    name: 'ActivityStatus',
    members: ActivityStatus,
  }),
]
