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
    match: ({ matchId }, _, { data }) =>
      data
        .get('matches')
        .find({ _id: matchId })
        .value(),
  },
}
