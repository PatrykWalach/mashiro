import { AuthenticationError } from 'apollo-server-express'
import { mutationField, objectType, queryField, nonNull } from 'nexus'

const User = objectType({
  name: 'User',
  definition(t) {
    t.model.id()
    t.model.accounts({ pagination: false })
    t.model.name()
    t.model.preferredRssFeedUri()
    t.model.avatarUrl()
    t.model.listEntries({
      filtering: true,
      ordering: true,
    })
  },
})

const UserQuery = queryField((t) => {
  // t.crud.users({
  //   pagination: false,
  //   filtering: { id: true },
  // })
  // t.crud.accounts()
  t.crud.users({
    filtering: {
      name: true,
    },
    pagination: false,
    ordering: {
      lastLoggedInAt: true,
    },
  })

  t.field('viewer', {
    type: nonNull('User'),
    async resolve(_, __, { prisma, userId }) {
      if (typeof userId !== 'number') {
        throw new AuthenticationError('must authenticate')
      }

      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
        include: {
          accounts: true,
          //  accounts: {
          //   include: {
          //     service: true,
          //   },
          // },
        },
        rejectOnNotFound: true,
      })

      prisma.user.update({
        data: {
          lastLoggedInAt: new Date(),
        },
        where: {
          id: user.id,
        },
      })

      return user
    },
  })
  // t.crud.user({
  //   alias: 'viewer',

  //   computedInputs: ({ ctx }) => ({
  //     where: { id: ctx.userId },
  //   }),
  // })
})

const UserMutation = mutationField((t) => {
  t.crud.createOneUser()
})

export default [User, UserQuery, UserMutation]
