import { app } from 'electron'
import { join } from 'path'
import { Resolvers } from './__generated__/MashiroActivity'

export default /* GraphQL */ `
  type Match {
    id: ID!
  }

  interface MashiroActivity {
    id: String!
    mediaTitle: String!
    episode: Int!
    className: String!
    startedAt: Int!
  }

  type PastActivity implements MashiroActivity {
    id: String!
    mediaTitle: String!
    episode: Int!
    className: String!
    startedAt: Int!
    completedAt: Int!
    uploadedAt: Int!
    match: Match!
  }

  type PendingActivity implements MashiroActivity {
    id: String!
    mediaTitle: String!
    episode: Int!
    className: String!
    startedAt: Int!
    completedAt: Int!
    match: Match
  }

  type CurrentActivity implements MashiroActivity {
    id: String!
    mediaTitle: String!
    episode: Int!
    className: String!
    startedAt: Int!
    match: Match
  }

  type Query {
    Activities: [MashiroActivity!]!
  }
`

interface MashiroActivityModel {
  _id: string
  mediaTitle: string
  episode: number
  className: string
  startedAt: number
}

export interface PastActivityModel extends MashiroActivityModel {
  completedAt: number
  uploadedAt: number
  matchId: string
}

export interface PendingActivityModel extends MashiroActivityModel {
  completedAt: number
  matchId?: string
}

export interface CurrentActivityModel extends MashiroActivityModel {
  matchId?: string
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
  PastActivity: {
    id: ({ _id }) => _id,
    match: ({ matchId }, _, { data }) =>
      data
        .get('matches')
        .find({ _id: matchId })
        .value(),
  },
  PendingActivity: {
    id: ({ _id }) => _id,
    match: ({ matchId }, _, { data }) =>
      data
        .get('matches')
        .find({ _id: matchId })
        .value(),
  },
  CurrentActivity: {
    id: ({ _id }) => _id,
    match: ({ matchId }, _, { data }) =>
      data
        .get('matches')
        .find({ _id: matchId })
        .value(),
  },
  Query: {
    Activities: (_, __, { data }) => data.get('activities').value(),
  },
}
