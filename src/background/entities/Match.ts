import { Resolvers } from './__generated__/Match'
import { app } from 'electron'
import Datastore from 'nedb'
import { join } from 'path'

export default /* GraphQL */ `
  type Media {
    id: Int!
  }
  type Match {
    id: ID!
    title: String!
    media: Media!
  }
`

export interface MatchModel {
  _id: string
  title: string
  mediaId: number
}

export const MatchResolvers: Resolvers = {
  Match: {
    id: ({ _id }) => _id,
    media: ({ mediaId }) => ({ id: mediaId }),
  },
}

export const matches = new Datastore<MatchModel>({
  filename: join(app.getPath('appData'), 'mashiro', 'matches.db'),
  autoload: true,
})
