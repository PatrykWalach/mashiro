import {
  enumType,
  mutationField,
  nonNull,
  objectType,
  queryField,
  subscriptionField,
} from 'nexus'

const ActivitySubscribe = subscriptionField(t => {
  t.field('activityUpdated', {
    type: 'ActivityUpdate',
    subscribe: (_, __, { pubsub, events }) =>
      pubsub.asyncIterator([events.ACTIVITY_UPDATED]),
    resolve: e => e,
  })
  t.field('activityAdded', {
    type: 'Activity',
    subscribe: (_, __, { pubsub, events }) =>
      pubsub.asyncIterator([events.ACTIVITY_ADDED]),
    resolve: e => e,
  })
})

enum ActivityStatus {
  WATCHING,
  WATCHED,
  UPDATED,
}

const ActivityMutation = mutationField(t => {
  t.field('finishActivity', {
    type: 'Activity',
    args: { id: nonNull('Int') },
    async resolve(_, { id }, { prisma, pubsub, events }) {
      const activityUpdated = await prisma.activity.update({
        where: { id },
        data: {
          status: ActivityStatus.WATCHED,
        },
      })

      pubsub.publish(events.ACTIVITY_UPDATED, activityUpdated)
      /*update list with activiry*/

      return activityUpdated
    },
  })
  t.field('updateActivityMedia', {
    type: 'Activity',
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
    type: 'Activity',
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
        pastActivityId === null
          ? await mediaIdLoader.load(anitomyResults.animeTitle)
          : pastActivityId

      const activityAdded = await prisma.activity.create({
        data: {
          ...anitomyResults,
          className: args.className,
          media:
            id === null || id === undefined
              ? undefined
              : {
                  connectOrCreate: { where: { id }, create: { id } },
                },
        },
      })

      pubsub.publish(events.ACTIVITY_ADDED, activityAdded)

      return activityAdded
    },
  })
})

export const AcivityType = objectType({
  name: 'Activity',
  definition(t) {
    t.implements('AnitomyResult')
    t.model.id()
    t.model.animeTitle()
    t.model.className()
    t.model.media()
    t.model.episodeNumber()
    t.model.fileExtension()
    t.model.fileName()
    t.nonNull.field('status', {
      type: 'ActivityStatus',
    })
    t.model.subgroup()
    t.model.updatedAt()
    t.model.videoResolution()
    t.model.animeTitle()
  },
})

const ActivityUpdate = objectType({
  name: 'ActivityUpdate',
  definition(t) {
    t.nonNull.int('id')
    t.nonNull.string('updatedAt')
    t.nonNull.field('status', { type: 'ActivityStatus' })
  },
})

const ActivityQuery = queryField(t =>
  t.crud.activities({
    ordering: { updatedAt: true, id: true },
    // filtering: { status: true },
  }),
)

export const Activity = {
  AcivityType,
  ActivityUpdate,
  ActivityQuery,
  ActivitySubscribe,
  ActivityMutation,
  ActivityStatus: enumType({
    name: 'ActivityStatus',
    members: ActivityStatus,
  }),
}
