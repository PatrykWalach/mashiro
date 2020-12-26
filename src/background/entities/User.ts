import { objectType, queryField } from 'nexus'

const UserType = objectType({
  name: 'User',
  definition(t) {
    // t.nonNull.string('preferredRssFeedUri')
    t.string('preferredRssFeedUri')
    t.model.id()
  },
})

const UserQuery = queryField(t => {
  t.crud.users({
    pagination: false,
    filtering: { id: true },
  })
})

export const User = { UserType, UserQuery }
