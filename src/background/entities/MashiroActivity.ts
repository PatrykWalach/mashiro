import { Resolvers } from './__generated__/MashiroActivity'

export default /* GraphQL */ `
  interface MashiroActivity {
    id: String!
    title: String!
    episode: Int!
    className: String!
    startedAt: Int!
  }

  type PastActivity implements MashiroActivity {
    id: String!
    title: String!
    episode: Int!
    className: String!
    startedAt: Int!
    completedAt: Int!
    uploadedAt: Int!
  }

  type PendingActivity implements MashiroActivity {
    id: String!
    title: String!
    episode: Int!
    className: String!
    startedAt: Int!
    completedAt: Int!
  }

  type CurrentActivity implements MashiroActivity {
    id: String!
    title: String!
    episode: Int!
    className: String!
    startedAt: Int!
  }

  type Query {
    Activities: [MashiroActivity!]!
  }
`

interface MashiroActivityModel {
  id: string
  title: string
  episode: number
  className: string
  startedAt: number
}

export interface PastActivityModel extends MashiroActivityModel {
  completedAt: number
  uploadedAt: number
  mediaId: number
}

export interface PendingActivityModel extends MashiroActivityModel {
  completedAt: number
  mediaId?: number
}

export interface CurrentActivityModel extends MashiroActivityModel {
  mediaId?: number
}

export const MashiroActivityResolvers: Resolvers = {
  MashiroActivity: {
    __resolveType(obj) {
      if ('uploadedAt' in obj) {
        return 'PastActivity'
      }
      if ('completedAt' in obj) {
        return 'PendingActivity'
      }
      return 'CurrentActivity'
    },
  },
  Query: {
    Activities: (_, __, { data }) => data.get('activities').values().value(),
  },
}
