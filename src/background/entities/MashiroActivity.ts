import { app } from 'electron'
import Datastore from 'nedb'
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

export const activities = new Datastore<
  CurrentActivityModel | PendingActivityModel | PastActivityModel
>({
  filename: join(app.getPath('appData'), 'mashiro', 'activities.db'),
  autoload: true,
})

activities.insert({
  _id: '',
  mediaTitle: 'Boku no Hero',
  className: '',
  episode: 0,
  startedAt: Math.floor(Date.now() / 1000),
})

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
    match: ({ matchId }, _, { db }) =>
      db.promise(cb => db.matches.findOne({ _id: matchId }, cb)),
  },
  PendingActivity: {
    id: ({ _id }) => _id,
    match: ({ matchId }, _, { db }) =>
      db.promise(cb => db.matches.findOne({ _id: matchId }, cb)),
  },
  CurrentActivity: {
    id: ({ _id }) => _id,
    match: ({ matchId }, _, { db }) =>
      db.promise(cb => db.matches.findOne({ _id: matchId }, cb)),
  },
  Query: {
    Activities: (_, __, { db }) => db.promise(cb => db.activities.find({}, cb)),
  },
}
