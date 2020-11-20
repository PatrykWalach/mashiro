import Datastore from 'nedb'
import { Resolvers } from './__generated__/File'

export default /* GraphQL */ `
  type Match {
    id: ID!
  }
  type File {
    id: ID!
    path: String!
    name: String!
    match: Match
    mediaTitle: String!
    episode: Int!
  }
`

export interface FileModel {
  _id: string
  path: string
  name: string
  matchId?: string
  mediaTitle: string
  episode: number
}

export const FileResolvers: Resolvers = {
  File: {
    id: ({ _id }) => _id,
    match: ({ matchId }, _, { db }) =>
      db.promise(cb => db.matches.findOne({ _id: matchId }, cb)),
  },
}

export const files = new Datastore<FileModel>()
