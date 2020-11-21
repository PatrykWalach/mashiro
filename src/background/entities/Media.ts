import { Resolvers } from './__generated__/Media'
import Datastore from 'nedb'
import { join } from 'path'
import { app } from 'electron'
import { valuesFromResults } from '../util'
import { MatchModel } from './Match'

export const MediaResolvers: Resolvers = {
  Media: {
    async alternativeTitles({ id }, _, { db }) {
      const matches = await db.promise<MatchModel[]>(cb =>
        db.matches.find({ mediaId: id }, cb),
      )

      return matches.map(({ title }) => title)
    },
  },
  Query: {
    async _media(_, { id_in = [] }, { db }) {
      const found = await db.promise<MediaModel[]>(cb =>
        db.media.find({ id: { $in: id_in } }, cb),
      )

      return valuesFromResults('id')(found, id_in)
    },
  },
}

export default /* GraphQL */ `
  type File {
    id: ID!
  }

  type Media {
    id: Int
    #  files: [File]
    episodeOffset: Int!
    alternativeTitles: [String]
  }

  type Query {
    _media(id_in: [Int!]!): [Media]
  }
`

interface MediaModel {
  id: number
  episodeOffset: number
}

export const media = new Datastore<MediaModel>({
  filename: join(app.getPath('appData'), 'mashiro', 'media.db'),
  autoload: true,
})

media.insert({
  id: 1,
  // fileTitles: ['Boy Cowboy'],
  episodeOffset: 1,
})
